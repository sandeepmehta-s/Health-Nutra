import express from "express";
import rateLimit from "express-rate-limit";
import {
  getActiveProducts,
  getProductById,
  getDistinctCategories,
  createOrder,
  getOrderById,
} from "../services/dbService.js";
import { cache } from "../services/cacheService.js";
import { orderRateLimiter, contactRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// ── Global public-API rate limiter ────────────────────────────
// 300 requests per minute per IP — generous for real users, stops hammering.
const publicApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please slow down." },
  skip: (req) => req.method === "GET" && req.path === "/ping", // never throttle keep-alive
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

// POST /api/orders - Customer Place Order
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

    let orderItems = Array.isArray(items) && items.length > 0 ? items : null;

    if (!orderItems && (req.body.productId || req.body.productName || req.body.name)) {
      orderItems = [
        {
          productId: req.body.productId || req.body.id || "1",
          name: req.body.productName || req.body.name || "Nutra Formulation",
          price: Number(req.body.unitPrice || req.body.price || 0),
          quantity: Math.max(1, parseInt(req.body.quantity || 1, 10)),
          unit: req.body.unit || "Unit",
          image: req.body.image || "/images/10q.png",
        },
      ];
    }

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "At least one product item is required to place an order." });
    }

    // Calculate total
    let computedTotal = 0;
    const cleanItems = orderItems.map((item) => {
      const q = Math.max(1, parseInt(item.quantity || 1, 10));
      const p = Math.max(0, Number(item.price || 0));
      computedTotal += p * q;
      return {
        productId: String(item.productId || item.id || "1"),
        name: String(item.name || item.productName || "Nutra Formulation"),
        price: p,
        quantity: q,
        unit: String(item.unit || "Unit"),
        image: String(item.image || "/images/10q.png"),
      };
    });

    const newOrder = await createOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: (customerEmail || "").trim(),
      shippingAddress: shippingAddress.trim(),
      city: (city || "").trim(),
      pincode: (pincode || "").trim(),
      items: cleanItems,
      totalAmount: computedTotal,
      paymentMethod: paymentMethod || "Cash on Delivery (COD)",
      paymentStatus: paymentMethod === "UPI / Online" ? "paid" : "cod",
      orderStatus: "pending",
      notes: (notes || "").trim(),
    });

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

// GET /api/orders/:id - Track order status by Order ID
router.get("/orders/:id", async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found. Please verify your Order ID." });
    }
    res.json({
      success: true,
      data: {
        orderId: order.orderId,
        id: order.id || order.orderId,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        shippingAddress: order.shippingAddress,
        city: order.city,
        pincode: order.pincode,
        items: order.items || [],
        productName: order.items && order.items[0] ? order.items[0].name : "Nutra Formulation",
        quantity: order.items && order.items[0] ? order.items[0].quantity : 1,
        orderStatus: order.orderStatus || order.status || "pending",
        status: order.orderStatus || order.status || "pending",
        paymentStatus: order.paymentStatus || "pending",
        paymentMethod: order.paymentMethod || "Cash on Delivery",
        totalAmount: order.totalAmount,
        notes: order.notes,
        createdAt: order.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error tracking order: " + err.message });
  }
});

// POST /api/contact - Customer Contact Inquiry Form
router.post("/contact", contactRateLimiter, async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide your Name, Email, and Message.",
      });
    }
    console.log(`[Contact Form] Received inquiry from ${name} (${email}, ${phone || "N/A"}): [${subject || "General"}] ${message}`);
    res.status(200).json({
      success: true,
      message: "Thank you! Your message has been received. Our clinical support team will contact you shortly.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to submit inquiry: " + err.message });
  }
});

export default router;

