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

// GET /api/orders/:id - Track order status with strict customer privacy protection
router.get("/orders/:id", trackingRateLimiter, async (req, res) => {
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

// POST /api/contact - Customer Contact Inquiry Form with Input Validation
router.post("/contact", contactRateLimiter, async (req, res) => {
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

