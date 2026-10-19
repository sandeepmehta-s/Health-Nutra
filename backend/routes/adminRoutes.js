import express from "express";
import {
  findAdminByUsername,
  getAllProductsAdmin,
  getProductById,
  createProduct,
  updateProduct,
  toggleProductStatus,
  deleteProduct,
  getAllOrdersAdmin,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../services/dbService.js";
import { requireAuth } from "../middleware/auth.js";
import { uploadProductImage } from "../middleware/upload.js";
import { loginRateLimiter } from "../middleware/rateLimiter.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

function sanitize(str) {
  if (typeof str !== "string") return str;
  return str.trim();
}

// -------------------------------------------------------------
// Authentication Endpoints
// -------------------------------------------------------------

// POST /api/admin/login (Rate limited)
router.post("/login", loginRateLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const cleanUsername = sanitize(username).toLowerCase();
    const admin = await findAdminByUsername(cleanUsername);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // Set Session
    req.session.adminId = admin.id;
    req.session.adminUsername = admin.username;
    req.session.adminName = admin.name;

    res.json({
      success: true,
      message: "Authentication successful.",
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server login error: " + err.message,
    });
  }
});

// POST /api/admin/logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Could not log out." });
    }
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "Logged out successfully." });
  });
});

// GET /api/admin/me - Verify current session
router.get("/me", requireAuth, (req, res) => {
  res.json({
    success: true,
    admin: {
      id: req.session.adminId,
      username: req.session.adminUsername,
      name: req.session.adminName,
    },
  });
});

// -------------------------------------------------------------
// Product Management Endpoints (All Protected by requireAuth)
// -------------------------------------------------------------

// GET /api/admin/products - List all products with optional search & filters
router.get("/products", requireAuth, async (req, res) => {
  try {
    const { search, category, status } = req.query;
    const result = await getAllProductsAdmin({ search, category, status });

    res.json({
      success: true,
      stats: result.stats,
      categories: result.categories,
      data: result.products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching admin products: " + err.message,
    });
  }
});

// GET /api/admin/products/:id - Single product
router.get("/products/:id", requireAuth, async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error: " + err.message });
  }
});

// POST /api/admin/products - Create new product
router.post(
  "/products",
  requireAuth,
  (req, res, next) => {
    uploadProductImage.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const { name, category, shortDescription, fullDescription, price, unit, status, imageUrl } = req.body;

      if (!name || !sanitize(name)) {
        return res.status(400).json({ success: false, message: "Product name is required." });
      }

      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice <= 0) {
        return res.status(400).json({ success: false, message: "Price must be a positive number greater than 0." });
      }

      if (!shortDescription || !sanitize(shortDescription)) {
        return res.status(400).json({ success: false, message: "Short description is required." });
      }

      let imagePath = "/uploads/9g.png";
      if (req.file) {
        imagePath = `/uploads/${req.file.filename}`;
      } else if (imageUrl && sanitize(imageUrl)) {
        imagePath = sanitize(imageUrl);
      } else if (req.body.existingImage) {
        imagePath = req.body.existingImage;
      }

      const saved = await createProduct({
        name: sanitize(name),
        category: sanitize(category) || "General",
        shortDescription: sanitize(shortDescription),
        fullDescription: sanitize(fullDescription) || "",
        price: numPrice,
        unit: sanitize(unit) || "Strip",
        image: imagePath,
        status: status === "hidden" ? "hidden" : "active",
      });

      res.status(201).json({
        success: true,
        message: `Product "${saved.name}" created successfully.`,
        data: saved,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to create product: " + err.message,
      });
    }
  }
);

// PUT /api/admin/products/:id - Update product
router.put(
  "/products/:id",
  requireAuth,
  (req, res, next) => {
    uploadProductImage.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const { name, category, shortDescription, fullDescription, price, unit, status, imageUrl } = req.body;

      const updateData = {};
      if (name) updateData.name = sanitize(name);
      if (category) updateData.category = sanitize(category);
      if (shortDescription) updateData.shortDescription = sanitize(shortDescription);
      if (fullDescription !== undefined) updateData.fullDescription = sanitize(fullDescription);
      if (unit) updateData.unit = sanitize(unit);
      if (status) updateData.status = status === "hidden" ? "hidden" : "active";

      if (price !== undefined) {
        const numPrice = Number(price);
        if (isNaN(numPrice) || numPrice <= 0) {
          return res.status(400).json({ success: false, message: "Price must be a positive number greater than 0." });
        }
        updateData.price = numPrice;
      }

      if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
      } else if (imageUrl && sanitize(imageUrl)) {
        updateData.image = sanitize(imageUrl);
      } else if (req.body.existingImage) {
        updateData.image = req.body.existingImage;
      }

      const updated = await updateProduct(req.params.id, updateData);
      if (!updated) {
        return res.status(404).json({ success: false, message: "Product not found." });
      }

      res.json({
        success: true,
        message: `Product "${updated.name}" updated successfully.`,
        data: updated,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to update product: " + err.message,
      });
    }
  }
);

// PATCH /api/admin/products/:id/toggle-status - Visibility toggle
router.patch("/products/:id/toggle-status", requireAuth, async (req, res) => {
  try {
    const updated = await toggleProductStatus(req.params.id);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    res.json({
      success: true,
      message: `Product "${updated.name}" is now ${updated.status}.`,
      status: updated.status,
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to toggle status: " + err.message,
    });
  }
});

// DELETE /api/admin/products/:id - Delete product
router.delete("/products/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    if (deleted.image && deleted.image.startsWith("/uploads/product-")) {
      const filePath = path.resolve(__dirname, "..", deleted.image.replace(/^\//, ""));
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, () => {});
      }
    }

    res.json({
      success: true,
      message: `Product "${deleted.name}" deleted successfully.`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product: " + err.message,
    });
  }
});

// -------------------------------------------------------------
// Order Management Endpoints (All Protected by requireAuth)
// -------------------------------------------------------------

// GET /api/admin/orders - List orders with search and status filter
router.get("/orders", requireAuth, async (req, res) => {
  try {
    const { search, status } = req.query;
    const result = await getAllOrdersAdmin({ search, status });
    res.json({
      success: true,
      stats: result.stats,
      data: result.orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders: " + err.message,
    });
  }
});

// GET /api/admin/orders/:id - Single order details
router.get("/orders/:id", requireAuth, async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to retrieve order: " + err.message });
  }
});

// PATCH /api/admin/orders/:id/status - Update order status, payment status, notes
router.patch("/orders/:id/status", requireAuth, async (req, res) => {
  try {
    const { orderStatus, paymentStatus, notes } = req.body;
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (orderStatus && !validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed: ${validStatuses.join(", ")}`,
      });
    }

    const updated = await updateOrderStatus(req.params.id, {
      orderStatus,
      paymentStatus,
      notes: notes !== undefined ? sanitize(notes) : undefined,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    res.json({
      success: true,
      message: `Order #${updated.orderId} updated successfully.`,
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update order: " + err.message });
  }
});

// DELETE /api/admin/orders/:id - Delete order
router.delete("/orders/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await deleteOrder(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }
    res.json({
      success: true,
      message: `Order #${deleted.orderId} deleted successfully.`,
      data: deleted,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete order: " + err.message });
  }
});

export default router;

