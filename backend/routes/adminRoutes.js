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
  syncAdminPassword,
  getAllEnquiriesAdmin,
  getEnquiryById,
  updateEnquiryStatus,
  deleteEnquiry,
  getAllEnquiriesForExport,
} from "../services/dbService.js";
import { requireAuth } from "../middleware/auth.js";
import { uploadProductImage, verifyImageMagicBytes } from "../middleware/upload.js";
import { loginRateLimiter } from "../middleware/rateLimiter.js";
import { cache } from "../services/cacheService.js";
import {
  isCloudinaryConfigured,
  isCloudinaryUrl,
  uploadImage,
  deleteImage,
  getBrandLogoUrl,
} from "../services/cloudinaryService.js";
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

// POST /api/admin/login (Rate limited, strictly authenticated via bcrypt, session regenerated)
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
    const cleanPassword = String(password).trim();

    // Look up administrator exclusively in database
    const admin = await findAdminByUsername(cleanUsername);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // Verify hashed password via bcrypt
    const isMatch = await admin.comparePassword(cleanPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // Set authenticated session data and handle regeneration safely
    const completeLogin = () => {
      req.session.adminId = admin.id;
      req.session.adminUsername = admin.username;
      req.session.adminName = admin.name || "Administrator";

      if (typeof req.session.save === "function") {
        req.session.save((saveErr) => {
          if (saveErr) {
            console.warn("[Auth] Session save warning:", saveErr.message);
          }
          return res.json({
            success: true,
            message: "Authentication successful.",
            admin: {
              id: req.session.adminId,
              username: req.session.adminUsername,
              name: req.session.adminName,
            },
          });
        });
      } else {
        return res.json({
          success: true,
          message: "Authentication successful.",
          admin: {
            id: req.session.adminId,
            username: req.session.adminUsername,
            name: req.session.adminName,
          },
        });
      }
    };

    if (typeof req.session?.regenerate === "function") {
      req.session.regenerate((err) => {
        if (err) {
          console.warn("[Auth] Session regeneration warning, preserving session:", err.message);
        }
        completeLogin();
      });
    } else {
      completeLogin();
    }
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
router.get("/me", (req, res) => {
  if (req.session && req.session.adminId) {
    return res.json({
      success: true,
      admin: {
        id: req.session.adminId,
        username: req.session.adminUsername,
        name: req.session.adminName,
      },
    });
  }
  return res.status(401).json({
    success: false,
    message: "Authentication required. Please log in.",
    admin: null,
  });
});

// -------------------------------------------------------------
// Product Management Endpoints (All Protected by requireAuth)
// -------------------------------------------------------------

// GET /api/admin/products - List all products with optional search, filters & pagination
router.get("/products", requireAuth, async (req, res) => {
  try {
    const { search, category, status, page, limit } = req.query;
    const result = await getAllProductsAdmin({ search, category, status, page, limit });

    res.json({
      success: true,
      pagination: result.pagination,
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
        // Enforce binary magic numbers validation to prevent MIME-spoofing
        if (!verifyImageMagicBytes(req.file.path)) {
          fs.unlink(req.file.path, () => {});
          return res.status(400).json({
            success: false,
            message: "Uploaded file failed binary signature check. Only valid JPEG, PNG, or WebP images are allowed.",
          });
        }
        if (isCloudinaryConfigured()) {
          try {
            const uploadRes = await uploadImage(req.file.path, { folder: "health-nutra/products" });
            imagePath = uploadRes.url;
            fs.unlink(req.file.path, () => {});
          } catch (cloudErr) {
            console.error("[Cloudinary] Upload failed, falling back to local file:", cloudErr.message);
            imagePath = `/uploads/${req.file.filename}`;
          }
        } else {
          imagePath = `/uploads/${req.file.filename}`;
        }
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

      // Bust product/category caches so storefront reflects change immediately
      cache.invalidate("products:");
      cache.invalidate("categories:");

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
        if (!verifyImageMagicBytes(req.file.path)) {
          fs.unlink(req.file.path, () => {});
          return res.status(400).json({
            success: false,
            message: "Uploaded file failed binary signature check. Only valid JPEG, PNG, or WebP images are allowed.",
          });
        }
        if (isCloudinaryConfigured()) {
          try {
            const uploadRes = await uploadImage(req.file.path, { folder: "health-nutra/products" });
            updateData.image = uploadRes.url;
            fs.unlink(req.file.path, () => {});
          } catch (cloudErr) {
            console.error("[Cloudinary] Upload failed, falling back to local file:", cloudErr.message);
            updateData.image = `/uploads/${req.file.filename}`;
          }
        } else {
          updateData.image = `/uploads/${req.file.filename}`;
        }
      } else if (imageUrl && sanitize(imageUrl)) {
        updateData.image = sanitize(imageUrl);
      } else if (req.body.existingImage) {
        updateData.image = req.body.existingImage;
      }

      const updated = await updateProduct(req.params.id, updateData);
      if (!updated) {
        return res.status(404).json({ success: false, message: "Product not found." });
      }

      cache.invalidate("products:");
      cache.invalidate("categories:");

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

    cache.invalidate("products:");
    cache.invalidate("categories:");

    res.json({
      success: true,
      message: `Product "${updated.name}" is now ${updated.status}.`,
      status: updated.status,
      product: updated,
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

    if (deleted.image) {
      if (isCloudinaryUrl(deleted.image)) {
        deleteImage(deleted.image).catch((err) => {
          console.error("[Cloudinary] Failed to delete image asset:", err.message);
        });
      } else if (deleted.image.startsWith("/uploads/product-")) {
        const filename = path.basename(deleted.image);
        const uploadsDir = path.resolve(__dirname, "..", "uploads");
        const filePath = path.join(uploadsDir, filename);
        if (filePath.startsWith(uploadsDir) && fs.existsSync(filePath)) {
          fs.unlink(filePath, () => {});
        }
      }
    }

    cache.invalidate("products:");
    cache.invalidate("categories:");

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

// GET /api/admin/orders - List orders with search, status filter & pagination
router.get("/orders", requireAuth, async (req, res) => {
  try {
    const { search, status, page, limit } = req.query;
    const result = await getAllOrdersAdmin({ search, status, page, limit });
    res.json({
      success: true,
      pagination: result.pagination,
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

// PATCH / POST /api/admin/orders/:id/status - Update order status, payment status, notes
const handleUpdateStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus, notes } = req.body;
    const validOrderStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    const validPaymentStatuses = ["pending", "paid", "cod", "failed", "refunded"];

    if (orderStatus && !validOrderStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed: ${validOrderStatuses.join(", ")}`,
      });
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment status. Allowed: ${validPaymentStatuses.join(", ")}`,
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
};

router.patch("/orders/:id/status", requireAuth, handleUpdateStatus);
router.post("/orders/:id/status", requireAuth, handleUpdateStatus);

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

// GET /api/admin/brand/logo - Get configured Brand Logo & Cloudinary status
router.get("/brand/logo", requireAuth, (req, res) => {
  res.json({
    success: true,
    data: {
      logoUrl: getBrandLogoUrl(),
      isCloudinaryConfigured: isCloudinaryConfigured(),
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || "usqwgkl7",
    },
  });
});

// POST /api/admin/brand/logo - Upload Brand Logo to Cloudinary
router.post(
  "/brand/logo",
  requireAuth,
  (req, res, next) => {
    uploadProductImage.single("logo")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "Please select an image file to upload as the logo." });
      }

      if (!verifyImageMagicBytes(req.file.path)) {
        fs.unlink(req.file.path, () => {});
        return res.status(400).json({
          success: false,
          message: "Uploaded file failed binary signature check. Only valid JPEG, PNG, or WebP images are allowed.",
        });
      }

      let logoUrl = "";
      if (isCloudinaryConfigured()) {
        try {
          const uploadRes = await uploadImage(req.file.path, {
            folder: "health-nutra/brand",
            public_id: "logo",
            overwrite: true,
          });
          logoUrl = uploadRes.url;
          fs.unlink(req.file.path, () => {});
        } catch (cloudErr) {
          console.error("[Cloudinary] Logo upload failed, saving locally:", cloudErr.message);
          logoUrl = `/uploads/${req.file.filename}`;
        }
      } else {
        logoUrl = `/uploads/${req.file.filename}`;
      }

      res.json({
        success: true,
        message: "Brand logo updated successfully.",
        data: { logoUrl },
      });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to upload logo: " + err.message });
    }
  }
);

// -------------------------------------------------------------
// Admin Customer Enquiries Endpoints
// -------------------------------------------------------------

// GET /api/admin/enquiries/export - Export all enquiries to CSV
router.get("/enquiries/export", requireAuth, async (req, res) => {
  try {
    const list = await getAllEnquiriesForExport();

    const headers = ["ID", "Date", "Name", "Email", "Phone", "Subject", "Status", "Message"];
    const rows = list.map((e) => [
      e.id,
      new Date(e.createdAt).toISOString(),
      `"${(e.name || "").replace(/"/g, '""')}"`,
      `"${(e.email || "").replace(/"/g, '""')}"`,
      `"${(e.phone || "").replace(/"/g, '""')}"`,
      `"${(e.subject || "").replace(/"/g, '""')}"`,
      e.status,
      `"${(e.message || "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const filename = `health-nutra-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(csvContent);
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to export enquiries: " + err.message });
  }
});

// GET /api/admin/enquiries - List all enquiries with pagination & search
router.get("/enquiries", requireAuth, async (req, res) => {
  try {
    const { search, status, page, limit } = req.query;
    const result = await getAllEnquiriesAdmin({
      search: sanitize(search),
      status: sanitize(status),
      page,
      limit,
    });
    res.json({
      success: true,
      data: result.enquiries,
      pagination: result.pagination,
      stats: result.stats,
      counts: result.stats,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch enquiries: " + err.message });
  }
});

// PATCH /api/admin/enquiries/:id/status - Update enquiry status
router.patch("/enquiries/:id/status", requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !["new", "contacted", "resolved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: "new", "contacted", "resolved".',
      });
    }
    const updated = await updateEnquiryStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Enquiry not found." });
    }
    res.json({
      success: true,
      message: `Enquiry marked as "${status}".`,
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update enquiry: " + err.message });
  }
});

// DELETE /api/admin/enquiries/:id - Delete enquiry
router.delete("/enquiries/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await deleteEnquiry(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Enquiry not found." });
    }
    res.json({
      success: true,
      message: "Enquiry deleted successfully.",
      data: deleted,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete enquiry: " + err.message });
  }
});

export default router;

