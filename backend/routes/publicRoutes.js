import express from "express";
import crypto from "crypto";
import rateLimit from "express-rate-limit";
import {
  getActiveProducts,
  getProductById,
  getDistinctCategories,
  createOrder,
  getOrderById,
  createEnquiry,
} from "../services/dbService.js";
import { cache } from "../services/cacheService.js";
import { orderRateLimiter, contactRateLimiter, trackingRateLimiter } from "../middleware/rateLimiter.js";
import { sendOrderNotifications, sendEnquiryNotification } from "../services/emailService.js";
import { generateInvoicePdfBuffer } from "../services/pdfService.js";

const router = express.Router();

// ── Global public-API rate limiter ────────────────────────────
// 300 requests per minute per IP — generous for real users, stops hammering.
const publicApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please slow down." },
  skip: (req) => process.env.NODE_ENV === "test" || (req.method === "GET" && req.path === "/ping"),
});

router.use(publicApiLimiter);

// Product & category cache TTL (seconds)
const PRODUCT_CACHE_TTL = 300;   // 5 minutes
const CATEGORY_CACHE_TTL = 600;  // 10 minutes

// GET /api/products - Returns only active products
router.get("/products", async (req, res) => {
  try {
    const category = req.query.category || null;
    const cacheKey = `products:${category || "all"}`;

    // Serve from cache when available
    const cached = cache.get(cacheKey);
    if (cached) {
      res.set("X-Cache", "HIT");
      return res.json(cached);
    }

    const products = await getActiveProducts(category);
    const payload = {
      success: true,
      count: products.length,
      data: products,
    };

    cache.set(cacheKey, payload, PRODUCT_CACHE_TTL);
    res.set("X-Cache", "MISS");
    res.set("Cache-Control", `public, max-age=${PRODUCT_CACHE_TTL}, stale-while-revalidate=60`);
    res.json(payload);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products: " + err.message,
    });
  }
});

// GET /api/products/:id - Returns single active product details
router.get("/products/:id", async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product || product.status !== "active") {
      return res.status(404).json({
        success: false,
        message: "Product not found or is currently inactive.",
      });
    }
    res.json({
      success: true,
      data: product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error retrieving product: " + err.message,
    });
  }
});

// GET /api/categories - Returns distinct active categories
router.get("/categories", async (req, res) => {
  try {
    const cacheKey = "categories:active";
    const cached = cache.get(cacheKey);
    if (cached) {
      res.set("X-Cache", "HIT");
      return res.json(cached);
    }

    const categories = await getDistinctCategories();
    const payload = { success: true, data: categories };

    cache.set(cacheKey, payload, CATEGORY_CACHE_TTL);
    res.set("X-Cache", "MISS");
    res.set("Cache-Control", `public, max-age=${CATEGORY_CACHE_TTL}, stale-while-revalidate=120`);
    res.json(payload);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories: " + err.message,
    });
  }
});

// POST /api/orders - Customer Place Order (Server-Side Price Lookup & Payment Verification)
router.post("/orders", orderRateLimiter, async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      city,
      pincode,
      items,
      paymentMethod,
      notes,
    } = req.body;

    if (!customerName || typeof customerName !== "string" || !customerName.trim()) {
      return res.status(400).json({ success: false, message: "Customer full name is required." });
    }

    if (!customerPhone || typeof customerPhone !== "string" || !customerPhone.trim()) {
      return res.status(400).json({ success: false, message: "Phone number is required for delivery coordination." });
    }

    if (!shippingAddress || typeof shippingAddress !== "string" || !shippingAddress.trim()) {
      return res.status(400).json({ success: false, message: "Shipping address is required." });
    }

    // Idempotency check: prevent duplicate order creation on network retries
    const idempotencyKey = req.headers["idempotency-key"] || req.body.idempotencyKey;
    if (idempotencyKey && typeof idempotencyKey === "string") {
      const existing = cache.get(`idempotency:${idempotencyKey.trim()}`);
      if (existing) {
        return res.status(200).json({
          success: true,
          message: "Order already placed (idempotent submission).",
          orderId: existing.orderId,
          data: existing,
        });
      }
    }

    // Parse items array
    let rawItems = Array.isArray(items) && items.length > 0 ? items : null;
    if (!rawItems && (req.body.productId || req.body.productName || req.body.name)) {
      rawItems = [
        {
          productId: req.body.productId || req.body.id || "1",
          quantity: req.body.quantity || 1,
        },
      ];
    }

    if (!rawItems || rawItems.length === 0) {
      return res.status(400).json({ success: false, message: "At least one product item is required to place an order." });
    }

    // Server-Side Pricing & Availability Validation: Never trust client-supplied prices!
    let computedTotal = 0;
    const cleanItems = [];

    for (const item of rawItems) {
      const pid = String(item.productId || item.id || "");
      let dbProduct = pid ? await getProductById(pid) : null;

      // Fallback search by name if ID was not matched
      if (!dbProduct && (item.name || item.productName)) {
        const allActive = await getActiveProducts();
        dbProduct = allActive.find(
          (p) => p.name.toLowerCase() === String(item.name || item.productName).toLowerCase()
        );
      }

      if (!dbProduct || dbProduct.status !== "active") {
        return res.status(400).json({
          success: false,
          message: `Formulation "${item.name || pid}" is currently unavailable or invalid.`,
        });
      }

      const verifiedPrice = Number(dbProduct.price);
      const verifiedQty = Math.max(1, Math.min(100, Math.floor(Number(item.quantity) || 1)));
      computedTotal += verifiedPrice * verifiedQty;

      cleanItems.push({
        productId: String(dbProduct.id || dbProduct._id),
        name: dbProduct.name,
        price: verifiedPrice, // Always server-calculated
        quantity: verifiedQty,
        unit: dbProduct.unit || "Unit",
        image: dbProduct.image || "/uploads/9g.png",
      });
    }

    // Validate payment method and initialize status safely
    const validPaymentMethods = ["Cash on Delivery (COD)", "UPI / Online"];
    const chosenPayment = validPaymentMethods.includes(paymentMethod)
      ? paymentMethod
      : "Cash on Delivery (COD)";

    // Online/UPI payments require external payment verification and start as "pending"
    const paymentStatus = chosenPayment === "Cash on Delivery (COD)" ? "cod" : "pending";

    // Generate collision-resistant order ID: HN-ORD-<timestamp36>-<hex>
    const randSuffix = crypto.randomBytes(3).toString("hex").toUpperCase();
    const timePart = Date.now().toString(36).toUpperCase();
    const orderId = `HN-ORD-${timePart}-${randSuffix}`;

    const newOrder = await createOrder({
      orderId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: (customerEmail || "").trim(),
      shippingAddress: shippingAddress.trim(),
      city: (city || "").trim(),
      pincode: (pincode || "").trim(),
      items: cleanItems,
      totalAmount: computedTotal,
      paymentMethod: chosenPayment,
      paymentStatus,
      orderStatus: "pending",
      notes: (notes || "").trim(),
    });

    // Cache idempotency key if provided
    if (idempotencyKey && typeof idempotencyKey === "string") {
      cache.set(`idempotency:${idempotencyKey.trim()}`, newOrder, 600); // 10 minutes
    }

    // Trigger transactional notifications in background
    sendOrderNotifications(newOrder).catch((err) =>
      console.warn("[Email Notification Error]", err.message)
    );

    res.status(201).json({
      success: true,
      message: "Order placed successfully! Our dispatch team will contact you shortly.",
      orderId: newOrder.orderId,
      data: newOrder,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to place order: " + err.message,
    });
  }
});

// GET /api/orders/:id (or /api/orders/track/:id) - Track order status with strict customer privacy protection
router.get(["/orders/:id", "/orders/track/:id"], trackingRateLimiter, async (req, res) => {
  try {
    const rawId = (req.params.id || "").trim();
    if (!rawId) {
      return res.status(400).json({ success: false, message: "Order ID is required." });
    }

    const order = await getOrderById(rawId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found. Please verify your Order ID." });
    }

    // Mask street address for public tracking privacy — show only city and pincode
    const maskedAddress = [order.city, order.pincode ? `PIN: ${order.pincode}` : ""]
      .filter(Boolean)
      .join(", ") || "Delivery Area Verified";

    res.json({
      success: true,
      data: {
        orderId: order.orderId,
        id: order.id || order.orderId,
        customerName: order.customerName,
        // PRIVACY ENFORCEMENT: Never expose customerPhone, customerEmail, or internal notes publicly
        shippingAddress: maskedAddress,
        city: order.city || "",
        pincode: order.pincode || "",
        items: (order.items || []).map((it) => ({
          productId: it.productId,
          name: it.name,
          quantity: it.quantity,
          unit: it.unit,
          price: it.price,
          image: it.image,
        })),
        productName: order.items && order.items[0] ? order.items[0].name : "Nutra Formulation",
        quantity: order.items && order.items[0] ? order.items[0].quantity : 1,
        orderStatus: order.orderStatus || order.status || "pending",
        status: order.orderStatus || order.status || "pending",
        paymentStatus: order.paymentStatus || "pending",
        paymentMethod: order.paymentMethod || "Cash on Delivery",
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error tracking order: " + err.message });
  }
});

// GET /api/orders/:id/invoice/download (or /invoice.pdf) - One-Click Direct Binary PDF Download
router.get(["/orders/:id/invoice/download", "/orders/:id/invoice.pdf"], async (req, res) => {
  try {
    const rawId = (req.params.id || "").trim();
    if (!rawId) {
      return res.status(400).json({ success: false, message: "Order ID is required." });
    }

    const order = await getOrderById(rawId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found. Please verify your Order Reference ID." });
    }

    const orderId = order.orderId || order.id || rawId;
    const pdfBuffer = await generateInvoicePdfBuffer(order);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="HealthNutra_Invoice_${orderId}.pdf"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    res.setHeader("Cache-Control", "no-cache");
    return res.end(pdfBuffer);
  } catch (err) {
    console.error("[PDF Generation Error]", err);
    res.status(500).json({ success: false, message: "Failed to generate PDF invoice: " + err.message });
  }
});

// GET /api/orders/:id/invoice - Render official Tax Invoice for Customer & One-Click PDF Download
router.get("/orders/:id/invoice", async (req, res) => {
  try {
    const rawId = (req.params.id || "").trim();
    if (!rawId) {
      return res.status(400).send("Order ID is required.");
    }

    const order = await getOrderById(rawId);
    if (!order) {
      return res.status(404).send("Order not found. Please verify your Order Reference ID.");
    }

    const orderId = order.orderId || order.id || rawId;

    // Check if client explicitly requested binary download via query flag
    const wantsDownload =
      req.query.download === "pdf" ||
      req.query.download === "1" ||
      req.query.download === "true" ||
      req.query.format === "pdf";

    if (wantsDownload) {
      const pdfBuffer = await generateInvoicePdfBuffer(order);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="HealthNutra_Invoice_${orderId}.pdf"`);
      res.setHeader("Content-Length", pdfBuffer.length);
      res.setHeader("Cache-Control", "no-cache");
      return res.end(pdfBuffer);
    }

    const createdAt = order.createdAt
      ? new Date(order.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : new Date().toLocaleDateString("en-IN");

    const items =
      order.items && Array.isArray(order.items) && order.items.length > 0
        ? order.items
        : [
            {
              name: order.productName || "Nutra Dietary Formulation",
              quantity: order.quantity || 1,
              price: order.unitPrice || order.totalAmount || 0,
              unit: "Strip",
            },
          ];

    const totalAmount = order.totalAmount || 0;
    const customerName = order.customerName || "Valued Customer";
    const customerPhone = order.customerPhone || "-";
    const customerEmail = order.customerEmail || "-";
    const shippingAddress =
      `${order.shippingAddress || ""}${order.city ? `, ${order.city}` : ""}${order.pincode ? ` - ${order.pincode}` : ""}` ||
      "Verified Address";
    const paymentMethod = order.paymentMethod || "Cash on Delivery";

    const invoiceHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tax Invoice #${orderId} - Health Nutra</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; margin: 0; padding: 24px; background: #f8fafc; }
    .invoice-card { max-width: 750px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 24px; }
    .logo-box { display: flex; align-items: center; gap: 14px; }
    .logo-img { width: 56px; height: 56px; object-fit: cover; border-radius: 12px; border: 1px solid #e2e8f0; }
    .brand-title { font-size: 22px; font-weight: 900; color: #166534; margin: 0; letter-spacing: -0.5px; }
    .brand-sub { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin: 2px 0 0 0; }
    .invoice-badge { text-align: right; }
    .invoice-title { font-size: 18px; font-weight: 900; color: #0f172a; margin: 0; }
    .invoice-id { font-size: 14px; font-weight: 800; color: #166534; font-family: monospace; margin-top: 2px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 18px; font-size: 12px; line-height: 1.6; }
    .card-title { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #f1f5f9; color: #475569; font-size: 11px; text-transform: uppercase; font-weight: 800; padding: 10px 14px; text-align: left; border-bottom: 2px solid #cbd5e1; }
    td { padding: 12px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
    .total-row { font-size: 16px; font-weight: 900; color: #166534; }
    .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b; line-height: 1.6; }
    .actions-bar { display: flex; justify-content: space-between; align-items: center; max-width: 750px; margin: 0 auto 16px auto; }
    .download-btn { background: #166534; color: white; padding: 10px 22px; border-radius: 10px; border: none; font-weight: bold; cursor: pointer; font-size: 13px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; box-shadow: 0 2px 4px rgba(22, 101, 52, 0.2); transition: background 0.15s ease; }
    .download-btn:hover { background: #14532d; }
    .print-btn { background: #f1f5f9; color: #334155; padding: 10px 18px; border-radius: 10px; border: 1px solid #cbd5e1; font-weight: bold; cursor: pointer; font-size: 13px; display: inline-flex; align-items: center; gap: 6px; }
    .print-btn:hover { background: #e2e8f0; }
    .back-btn { color: #64748b; text-decoration: none; font-size: 13px; font-weight: 600; }
    .download-toast { display: none; background: #dcfce7; border: 1px solid #86efac; color: #166534; padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; margin-bottom: 12px; text-align: center; }
    @media print {
      body { background: white; padding: 0; }
      .invoice-card { border: none; box-shadow: none; padding: 0; }
      .actions-bar { display: none; }
    }
  </style>
</head>
<body>
  <div class="actions-bar">
    <a href="https://healthnutra.co.in" class="back-btn">← Back to Health Nutra</a>
    <div style="display: flex; gap: 10px; align-items: center;">
      <a href="/api/orders/${orderId}/invoice/download" class="download-btn" id="autoDownloadBtn" download>
        <span>⬇️ One-Click Auto Download PDF</span>
      </a>
      <button class="print-btn" onclick="window.print()">🖨️ Print Preview</button>
    </div>
  </div>

  <div id="downloadNotice" class="download-toast">
    ✅ Your official Health Nutra invoice PDF download has started!
  </div>

  <div class="invoice-card">
    <div class="header">
      <div class="logo-box">
        <img src="https://res.cloudinary.com/usqwgkl7/image/upload/v1792576055/logo.jpg" alt="Health Nutra" class="logo-img" />
        <div>
          <h1 class="brand-title">HEALTH NUTRA™</h1>
          <p class="brand-sub">Nutraceutical & Botanical Formulations</p>
        </div>
      </div>
      <div class="invoice-badge">
        <h2 class="invoice-title">OFFICIAL TAX INVOICE</h2>
        <div class="invoice-id">#${orderId}</div>
        <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Date: ${createdAt}</div>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <div class="card-title">Marketed & Dispatched By</div>
        <strong style="color: #0f172a; font-size: 13px;">HEALTH NUTRA™</strong><br>
        Shop No/ Plot No.: 247, SLICE-2, SECTOR-A, SCHEME NO 78,<br>
        INDORE - 452010 Dist.-INDORE (M.P.)<br>
        <strong>Hotline:</strong> +91 8809672959 / +91 7024308660<br>
        <strong>Email:</strong> healthnutra16@gmail.com
      </div>
      <div class="card">
        <div class="card-title">Customer & Delivery Info</div>
        <strong style="color: #0f172a; font-size: 13px;">${customerName}</strong><br>
        <strong>Phone:</strong> ${customerPhone}<br>
        <strong>Email:</strong> ${customerEmail}<br>
        <strong>Address:</strong> ${shippingAddress}
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 50%;">Formulation Description</th>
          <th style="text-align: center;">Unit</th>
          <th style="text-align: right;">Price (₹)</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map((it) => {
            const p = parseFloat(it.price) || 0;
            const q = parseInt(it.quantity, 10) || 1;
            return `
            <tr>
              <td><strong>${it.name || "Nutra Formulation"}</strong></td>
              <td style="text-align: center; color: #64748b;">${it.unit || "Strip"}</td>
              <td style="text-align: right;">₹${p.toFixed(2)}</td>
              <td style="text-align: center; font-weight: bold;">${q}</td>
              <td style="text-align: right; font-weight: bold; color: #0f172a;">₹${(p * q).toFixed(2)}</td>
            </tr>
          `;
          })
          .join("")}
        <tr class="total-row">
          <td colspan="4" style="text-align: right; padding-top: 16px;">Grand Total (${paymentMethod}):</td>
          <td style="text-align: right; padding-top: 16px;">₹${parseFloat(totalAmount).toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <!-- Digital Seal & Founder Signature Section -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin: 26px 0 20px 0; padding-top: 18px; border-top: 1px solid #e2e8f0;">
      
      <!-- Digital Corporate Seal Box -->
      <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; gap: 16px;">
        <div style="width: 72px; height: 72px; border: 2.5px solid #166534; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; background: #ffffff; flex-shrink: 0; box-shadow: 0 2px 6px rgba(22, 101, 52, 0.1);">
          <div style="position: absolute; inset: 2px; border: 1px dashed #f59e0b; border-radius: 50%;"></div>
          <div style="font-size: 5.5px; font-weight: 900; color: #166534; letter-spacing: 0.5px;">HEALTH NUTRA</div>
          <div style="font-size: 6px; font-weight: 900; color: #0f172a; margin: 1px 0;">DIGITALLY</div>
          <div style="font-size: 7px; font-weight: 900; color: #166534;">VERIFIED</div>
          <div style="font-size: 5.5px; font-weight: 800; color: #ea580c;">✔ OFFICIAL SEAL</div>
          <div style="font-size: 4.5px; color: #64748b;">INDORE (M.P.)</div>
        </div>
        <div>
          <div style="font-size: 11px; font-weight: 900; color: #166534; letter-spacing: 0.3px;">DIGITAL AUDIT & SEAL</div>
          <div style="font-size: 10px; color: #475569; margin-top: 3px; line-height: 1.45;">
            • Authentic batch release<br>
            • <strong>Cert ID:</strong> HN-IND-${orderId}<br>
            • WHO-GMP & ISO 9001:2015<br>
            • Cryptographically Sealed
          </div>
        </div>
      </div>

      <!-- Founder & CEO Digital Signature Box -->
      <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 14px 18px;">
        <div style="font-size: 9.5px; font-weight: 800; color: #64748b; letter-spacing: 0.5px;">FOR HEALTH NUTRA™</div>
        <div style="margin: 4px 0 6px 0; height: 38px; display: flex; align-items: flex-end;">
          <svg style="width: 140px; height: 32px;" viewBox="0 0 160 40" fill="none">
            <path d="M10 32 C18 10, 26 8, 34 26 C40 38, 46 16, 54 22 C62 26, 70 14, 82 22 C96 30, 114 14, 134 20 C150 24, 126 36, 155 24" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 5px;">
          <div style="font-size: 12px; font-weight: 900; color: #0f172a;">Mr. Veer Pratap Singh</div>
          <div style="font-size: 10px; font-weight: 800; color: #166534;">Founder & CEO</div>
          <div style="font-size: 9px; color: #64748b;">Authorized Corporate Signatory • Health Nutra™</div>
        </div>
      </div>

    </div>

    <div class="footer">
      <p>This is a computer-generated official tax invoice and requires no physical signature.</p>
      <p>Marketed by: HEALTH NUTRA™ • TM TRADEMARK APPLIED FOR • WHO-GMP & ISO 9001:2015 COMPLIANT</p>
      <p>Customer Support: <a href="tel:+918809672959" style="color: #166534; font-weight: bold; text-decoration: none;">+91 8809672959</a> / <a href="tel:+917024308660" style="color: #166534; font-weight: bold; text-decoration: none;">+91 7024308660</a> | <a href="mailto:healthnutra16@gmail.com" style="color: #166534; font-weight: bold; text-decoration: none;">healthnutra16@gmail.com</a></p>
    </div>
  </div>

  <script>
    // Handle Auto-Download trigger if requested via ?auto=true or ?auto=1
    (function() {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('auto') === 'true' || urlParams.get('auto') === '1' || urlParams.get('download') === '1') {
        const notice = document.getElementById('downloadNotice');
        if (notice) notice.style.display = 'block';
        setTimeout(function() {
          window.location.href = '/api/orders/${orderId}/invoice/download';
        }, 300);
      }
    })();
  </script>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(invoiceHtml);
  } catch (err) {
    res.status(500).send("Error generating invoice: " + err.message);
  }
});

// POST /api/contact (or /api/enquiries) - Customer Contact Inquiry Form with Input Validation
router.post(["/contact", "/enquiries"], contactRateLimiter, async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide your Name, Email, and Message.",
      });
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide your Name, Email, and Message with a valid email address.",
      });
    }
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide your Name, Email, and Message.",
      });
    }

    // Store customer inquiry securely in MongoDB
    const saved = await createEnquiry({
      name,
      email,
      phone: phone || "",
      subject: subject || "General",
      message,
    });

    // Safe structured logging without dumping full customer records
    const safeName = name.trim().slice(0, 30);
    const safeSubject = String(subject || "General").slice(0, 40);
    console.log(`[Contact Form] Stored inquiry #${saved.id} from "${safeName}" - Subject: "${safeSubject}"`);

    // Trigger admin email alert in background
    sendEnquiryNotification(saved).catch((err) =>
      console.warn("[Email Notification Error]", err.message)
    );

    res.status(200).json({
      success: true,
      message: "Thank you! Your message has been received. Our clinical support team will contact you shortly.",
      data: saved,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to submit inquiry: " + err.message });
  }
});

export default router;

