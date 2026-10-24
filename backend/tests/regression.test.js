/**
 * Health Nutra - Comprehensive Regression Test Suite
 * Validates full public storefront journey, customer order & tracking lifecycle,
 * admin workflow, and verifies that prior bug regressions do not recur.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.TEST_API_URL || "http://localhost:5000";

describe("Regression Tests: Public Storefront & Asset Integrity", () => {
  test("GET / returns 200 OK and valid HTML document with React mount point", async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("<!DOCTYPE html>"), "Must be valid HTML5");
    assert.ok(html.includes("HEALTH NUTRA"), "Must contain brand name");
    assert.ok(html.includes('id="root"'), "Must contain root mount element");
    assert.ok(html.includes("/components/ui/Icon.jsx"), "Must load pure React Icon component");
  });

  test("GET /api.json returns standardized API configuration", async () => {
    const res = await fetch(`${BASE_URL}/api.json`);
    assert.equal(res.status, 200);
    const config = await res.json();
    assert.equal(config.appName, "Health Nutra");
    assert.equal(config.endpoints.contact, "/api/contact");
    assert.equal(config.endpoints.products, "/api/products");
    assert.equal(config.endpoints.orders, "/api/orders");
  });

  test("GET /health returns healthy status with uptime and ISO timestamp", async () => {
    const res = await fetch(`${BASE_URL}/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, "healthy");
    assert.ok(typeof data.uptime === "number" && data.uptime > 0);
    assert.ok(!isNaN(Date.parse(data.timestamp)));
  });

  test("GET /api/products returns active formulations with required schema", async () => {
    const res = await fetch(`${BASE_URL}/api/products`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(Array.isArray(data.data));
    assert.ok(data.data.length >= 4, "Storefront must never be empty");

    for (const prod of data.data) {
      assert.ok(prod.id, "Product must have an id");
      assert.ok(prod.name, "Product must have a name");
      assert.ok(prod.category, "Product must have a category");
      if (prod.pricePending) {
        assert.equal(prod.price, null, "Pending products must not expose placeholder prices");
        assert.equal(prod.mrp, null, "Pending products must not expose placeholder MRPs");
      } else {
        assert.ok(prod.price > 0, "Priced product must have positive price");
        assert.equal(prod.status, "active", "Priced product must be active");
      }
      assert.ok(prod.image, "Product must have an image path");
    }
  });

  test("GET /api/categories contains all core therapeutic categories", async () => {
    const res = await fetch(`${BASE_URL}/api/categories`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(Array.isArray(data.data));
    const required = ["All", "Multivitamin", "Syrup"];
    for (const req of required) {
      assert.ok(data.data.includes(req), `Categories must include ${req}`);
    }
  });

  test("All product showcase images exist and return 200 OK with non-zero binary length", async () => {
    const images = ["9g.png", "10q.png", "omega3.png", "greentea.png"];
    for (const img of images) {
      const res = await fetch(`${BASE_URL}/images/${img}`);
      assert.equal(res.status, 200, `Image /images/${img} must return 200 OK`);
      const len = parseInt(res.headers.get("content-length") || "0", 10);
      assert.ok(len > 50000, `Image /images/${img} binary size must be valid (got ${len} bytes)`);
    }
  });

  test("Navbar.jsx source code regression check: No automatic checkAdminAuth() call", () => {
    const navbarPath = path.resolve(__dirname, "../../frontend/components/Navbar.jsx");
    const content = fs.readFileSync(navbarPath, "utf8");
    assert.ok(
      !content.includes("apiHelper.checkAdminAuth"),
      "Navbar must NOT call checkAdminAuth on public page loads"
    );
    assert.ok(
      !content.includes("/api/admin/me"),
      "Navbar must NOT contain hardcoded calls to /api/admin/me"
    );
  });
});

describe("Regression Tests: End-to-End Customer Order & Tracking Flow", () => {
  let placedOrderId = "";

  test("Step 1: Customer submits contact inquiry via POST /api/contact", async () => {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Dr. Sunita Rao",
        email: "sunita.rao@example.com",
        phone: "+91 98450 12345",
        subject: "Bulk Order & Dealership",
        message: "Requesting distributor catalog and wholesale pricing for 9G and 10Q.",
      }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.match(data.message, /message has been received/i);
  });

  test("Step 2: Customer places new formulation order via POST /api/orders", async () => {
    const orderPayload = {
      customerName: "Sunita Rao",
      customerPhone: "+91 98450 12345",
      customerEmail: "sunita.rao@example.com",
      shippingAddress: "B-204, Palm Springs Residency, Whitefield",
      city: "Bengaluru",
      pincode: "560066",
      paymentMethod: "Cash on Delivery (COD)",
      items: [
        { productId: "1", name: "Health Nutra 9G", price: 235, quantity: 2, unit: "Strip", image: "/images/9g.png" },
        { productId: "2", name: "Health Nutra 10Q Syrup", price: 210, quantity: 1, unit: "200ml", image: "/images/10q.png" },
      ],
      notes: "Please call before delivery.",
    };

    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });
    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.orderId && data.orderId.startsWith("HN-ORD-"));
    assert.equal(data.data.totalAmount, 235 * 2 + 210); // 680
    assert.equal(data.data.orderStatus, "pending");

    placedOrderId = data.orderId;
  });

  test("Step 3: Customer tracks live status via GET /api/orders/:id", async () => {
    assert.ok(placedOrderId, "Order ID must be present from Step 2");
    const res = await fetch(`${BASE_URL}/api/orders/${placedOrderId}`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.data.orderId, placedOrderId);
    assert.equal(data.data.customerName, "Sunita Rao");
    assert.equal(data.data.city, "Bengaluru");
    assert.equal(data.data.totalAmount, 680);
    assert.equal(data.data.orderStatus, "pending");
    assert.equal(data.data.items.length, 2);
  });
});

describe("Regression Tests: End-to-End Admin Portal Flow", () => {
  let sessionCookie = "";
  let createdProductId = "";

  test("Step 1: Admin logs in with valid credentials via POST /api/admin/login", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admin123" }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.admin.username, "admin");

    const rawCookie = res.headers.get("set-cookie");
    assert.ok(rawCookie, "Must set session cookie");
    sessionCookie = rawCookie.split(";")[0];
  });

  test("Step 2: Admin checks authenticated session via GET /api/admin/me", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/me`, {
      headers: { Cookie: sessionCookie },
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.admin.username, "admin");
  });

  test("Step 3: Admin lists formulations via GET /api/admin/products", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/products`, {
      headers: { Cookie: sessionCookie },
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.stats.total >= 4);
    assert.ok(Array.isArray(data.data));
  });

  test("Step 4: Admin creates new formulation via POST /api/admin/products", async () => {
    const newProduct = {
      name: "Regression Test Calcium Citrate D3",
      category: "Multivitamin",
      shortDescription: "Elemental Calcium with Vitamin D3",
      fullDescription: "High-absorption calcium supplement for bone density.",
      price: 195,
      unit: "Bottle",
      imageUrl: "/images/9g.png",
      status: "active",
    };

    const res = await fetch(`${BASE_URL}/api/admin/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
      },
      body: JSON.stringify(newProduct),
    });
    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.data.name, newProduct.name);
    assert.equal(data.data.price, 195);
    createdProductId = data.data.id;
  });

  test("Step 5: Admin toggles formulation status via PATCH /api/admin/products/:id/toggle-status", async () => {
    assert.ok(createdProductId);
    const res = await fetch(`${BASE_URL}/api/admin/products/${createdProductId}/toggle-status`, {
      method: "PATCH",
      headers: { Cookie: sessionCookie },
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.product.status, "hidden");

    // Toggle back to active
    const res2 = await fetch(`${BASE_URL}/api/admin/products/${createdProductId}/toggle-status`, {
      method: "PATCH",
      headers: { Cookie: sessionCookie },
    });
    assert.equal(res2.status, 200);
    const data2 = await res2.json();
    assert.equal(data2.product.status, "active");
  });

  test("Step 6: Admin deletes test formulation via DELETE /api/admin/products/:id", async () => {
    assert.ok(createdProductId);
    const res = await fetch(`${BASE_URL}/api/admin/products/${createdProductId}`, {
      method: "DELETE",
      headers: { Cookie: sessionCookie },
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
  });

  test("Step 7: Admin logs out via POST /api/admin/logout", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/logout`, {
      method: "POST",
      headers: { Cookie: sessionCookie },
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);

    // Verify session is invalidated
    const verifyRes = await fetch(`${BASE_URL}/api/admin/me`, {
      headers: { Cookie: sessionCookie },
    });
    assert.equal(verifyRes.status, 401);
  });
});
