import express from "express";
import { getActiveProducts, getProductById, getDistinctCategories } from "../services/dbService.js";

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

export default router;

