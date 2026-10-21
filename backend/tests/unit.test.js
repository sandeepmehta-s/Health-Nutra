/**
 * Health Nutra - Comprehensive Unit Test Suite
 * Covers DB service, authentication, order workflows, search ranking algorithm,
 * icon name resolution, and API URL resolver.
 */

import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import {
  initDatabase,
  getActiveProducts,
  getProductById,
  getDistinctCategories,
  findAdminByUsername,
  createOrder,
  getOrderById,
  updateOrderStatus,
} from "../services/dbService.js";

describe("Unit Tests: Database Service & Core Logic", () => {
  before(async () => {
    await initDatabase();
  });

  after(async () => {
    if (mongoose.connection && mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  test("DB Service - getActiveProducts returns populated list of active products", async () => {
    const products = await getActiveProducts();
    assert.ok(Array.isArray(products), "Products must be an array");
    assert.ok(products.length >= 4, "Should have at least 4 starter products");

    const sample = products[0];
    assert.ok(sample.id || sample._id, "Product should have an id");
    assert.ok(typeof sample.name === "string" && sample.name.length > 0, "Product must have a name");
    assert.ok(typeof sample.category === "string", "Product must have a category");
    assert.ok(typeof sample.price === "number" && sample.price > 0, "Product price must be a positive number");
    assert.equal(sample.status, "active", "Product status should be active");
    assert.ok(sample.image && sample.image.length > 0, "Product must have an image path");
  });

  test("DB Service - getActiveProducts filters by category correctly", async () => {
    const multivitamins = await getActiveProducts("Multivitamin");
    assert.ok(Array.isArray(multivitamins));
    assert.ok(multivitamins.length > 0);
    for (const p of multivitamins) {
      assert.equal(p.category, "Multivitamin");
    }

    const syrups = await getActiveProducts("Syrup");
    assert.ok(Array.isArray(syrups));
    assert.ok(syrups.length > 0);
    for (const p of syrups) {
      assert.equal(p.category, "Syrup");
    }
  });

  test("DB Service - getProductById returns correct formulation", async () => {
    const products = await getActiveProducts();
    const firstProduct = products[0];
    const retrieved = await getProductById(firstProduct.id);

    assert.ok(retrieved, "Product should be found by ID");
    assert.equal(retrieved.id, firstProduct.id);
    assert.equal(retrieved.name, firstProduct.name);
  });

  test("DB Service - getDistinctCategories includes required core categories", async () => {
    const categories = await getDistinctCategories();
    assert.ok(Array.isArray(categories));
    assert.ok(categories.includes("All"), "Must include All");
    assert.ok(categories.includes("Multivitamin"), "Must include Multivitamin");
    assert.ok(categories.includes("Syrup"), "Must include Syrup");
    assert.ok(categories.includes("Omega-3"), "Must include Omega-3");
    assert.ok(categories.includes("Green Tea"), "Must include Green Tea");
  });

  test("DB Service - Admin authentication and password verification", async () => {
    const admin = await findAdminByUsername("admin");
    assert.ok(admin, "Default admin user must exist");
    assert.equal(admin.username, "admin");

    const isMatch = await admin.comparePassword("admin123");
    assert.equal(isMatch, true, "Valid password 'admin123' must match");

    const isBadMatch = await admin.comparePassword("wrongpassword");
    assert.equal(isBadMatch, false, "Invalid password must not match");
  });

  test("DB Service - Order creation calculates totals and defaults correctly", async () => {
    const testOrder = {
      customerName: "Dr. Vikram Sethi",
      customerPhone: "+91 98765 00000",
      customerEmail: "vikram@example.com",
      shippingAddress: "Clinic 5, Health Enclave",
      city: "New Delhi",
      pincode: "110001",
      paymentMethod: "Cash on Delivery (COD)",
      items: [
        { productId: "1", name: "Health Nutra 9G", price: 235, quantity: 2, unit: "Strip" },
        { productId: "3", name: "Omega-3 Capsules", price: 499, quantity: 1, unit: "Strip" },
      ],
      totalAmount: 235 * 2 + 499,
    };

    const created = await createOrder(testOrder);
    assert.ok(created, "Order must be created successfully");
    assert.ok(created.orderId && created.orderId.startsWith("HN-ORD-"), "Order ID must have HN-ORD- prefix");
    assert.equal(created.customerName, testOrder.customerName);
    assert.equal(created.totalAmount, 969);
    assert.equal(created.orderStatus, "pending");
    assert.equal(created.paymentStatus, "pending");

    // Retrieve order
    const retrieved = await getOrderById(created.orderId);
    assert.ok(retrieved, "Created order must be retrievable by orderId");
    assert.equal(retrieved.customerName, testOrder.customerName);
    assert.equal(retrieved.items.length, 2);

    // Update order status
    const updated = await updateOrderStatus(created.orderId, {
      orderStatus: "shipped",
      paymentStatus: "paid",
      notes: "Dispatched via Bluedart Tracking #BD12345",
    });
    assert.ok(updated, "Updated order must be returned");
    assert.equal(updated.orderStatus, "shipped");
    assert.equal(updated.paymentStatus, "paid");
  });
});

describe("Unit Tests: Search & Priority Ranking Algorithm", () => {
  // Pure algorithm as implemented in HomePage.jsx
  function rankProducts(products, query) {
    const q = query.trim().toLowerCase();
    if (!q) return products;

    const scored = [];
    for (const p of products) {
      const name = (p.name || "").toLowerCase();
      const cat = (p.category || "").toLowerCase();
      const shortDesc = (p.shortDescription || "").toLowerCase();

      let score = 0;
      if (name === q) score += 1000;
      else if (name.startsWith(q)) score += 500;
      else if (name.split(/\s+/).some((w) => w.startsWith(q))) score += 300;
      else if (name.includes(q)) score += 150;

      if (cat.includes(q)) score += 80;
      if (shortDesc.includes(q)) score += 40;

      if (score > 0) {
        scored.push({ ...p, _score: score });
      }
    }
    return scored.sort((a, b) => b._score - a._score);
  }

  const sampleCatalog = [
    { name: "Omega-3 Capsules", category: "Omega-3", shortDescription: "Heart wellness" },
    { name: "Health Nutra 9G", category: "Multivitamin", shortDescription: "9 vital extracts" },
    { name: "Health Nutra 10Q Syrup", category: "Syrup", shortDescription: "CoQ10 antioxidant tonic" },
    { name: "Green Tea Extract", category: "Green Tea", shortDescription: "Standardized EGCG" },
  ];

  test("Exact product match receives absolute top rank (score >= 1000)", () => {
    const results = rankProducts(sampleCatalog, "health nutra 9g");
    assert.ok(results.length > 0);
    assert.equal(results[0].name, "Health Nutra 9G");
    assert.ok(results[0]._score >= 1000);
  });

  test("Prefix search prioritizes matching start of words", () => {
    const results = rankProducts(sampleCatalog, "green");
    assert.ok(results.length > 0);
    assert.equal(results[0].name, "Green Tea Extract");
    assert.ok(results[0]._score >= 500);
  });

  test("Category-based search returns formulations under that category", () => {
    const results = rankProducts(sampleCatalog, "syrup");
    assert.ok(results.length > 0);
    assert.equal(results[0].name, "Health Nutra 10Q Syrup");
  });

  test("Empty query returns full list without filtering", () => {
    const results = rankProducts(sampleCatalog, "");
    assert.equal(results.length, sampleCatalog.length);
  });
});

describe("Unit Tests: Icon Component Helper Logic", () => {
  function toPascalCase(name) {
    if (!name || typeof name !== "string") return "";
    return name
      .trim()
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
  }

  test("Kebab-case icon names convert accurately to PascalCase", () => {
    assert.equal(toPascalCase("shopping-bag"), "ShoppingBag");
    assert.equal(toPascalCase("trash-2"), "Trash2");
    assert.equal(toPascalCase("shield-check"), "ShieldCheck");
    assert.equal(toPascalCase("refresh-cw"), "RefreshCw");
    assert.equal(toPascalCase("menu"), "Menu");
    assert.equal(toPascalCase("x"), "X");
  });
});

describe("Unit Tests: API Helper URL Resolution", () => {
  function resolveUrl(template, params = {}) {
    let endpoint = template;
    Object.keys(params).forEach((key) => {
      endpoint = endpoint.replace(`:${key}`, encodeURIComponent(params[key]));
    });
    return endpoint;
  }

  test("Replaces route parameters correctly", () => {
    const url = resolveUrl("/api/products/:id", { id: "prod-456" });
    assert.equal(url, "/api/products/prod-456");

    const orderUrl = resolveUrl("/api/orders/:id", { id: "HN-ORD-1001" });
    assert.equal(orderUrl, "/api/orders/HN-ORD-1001");
  });

  test("Handles special characters with URL encoding", () => {
    const url = resolveUrl("/api/products/:id", { id: "item 100&50" });
    assert.equal(url, "/api/products/item%20100%2650");
  });
});
