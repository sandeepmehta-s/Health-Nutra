import express from "express";
import {
  getActiveProducts,
  getProductById,
  getDistinctCategories,
  createOrder,
  getOrderById,
} from "../services/dbService.js";

const router = express.Router();

// GET /api/products - Returns only active products
router.get("/products", async (req, res) => {
  try {
    const category = req.query.category || null;
    const products = await getActiveProducts(category);

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
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
    const categories = await getDistinctCategories();
    res.json({
      success: true,
      data: categories,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories: " + err.message,
    });
  }
});

// POST /api/orders - Customer Place Order
router.post("/orders", async (req, res) => {
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
      return res.status(404).json({ success: false, message: "Order not found." });
    }
    res.json({
      success: true,
      data: {
        orderId: order.orderId,
        customerName: order.customerName,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount,
        itemsCount: order.items.length,
        createdAt: order.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error tracking order: " + err.message });
  }
});

export default router;

