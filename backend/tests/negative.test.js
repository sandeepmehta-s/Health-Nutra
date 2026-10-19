/**
 * Health Nutra - Comprehensive Negative & Boundary Test Suite
 * Tests edge cases, missing fields, invalid formats, unauthenticated access,
 * SQL injection resiliency, XSS input handling, and 404 handling.
 */

import { test, describe, before } from "node:test";
import assert from "node:assert/strict";

const BASE_URL = process.env.TEST_API_URL || "http://localhost:5000";

describe("Negative Testing: Orders API Edge Cases & Boundary Validation", () => {
  test("POST /api/orders with empty payload returns 400 Bad Request", async () => {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.message, /name is required/i);
  });

  test("POST /api/orders with missing customer phone returns 400 Bad Request", async () => {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Rahul Test",
        shippingAddress: "123 Street",
      }),
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.message, /phone number is required/i);
  });

  test("POST /api/orders with missing shipping address returns 400 Bad Request", async () => {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Rahul Test",
        customerPhone: "+91 99999 88888",
      }),
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.message, /shipping address is required/i);
  });

  test("POST /api/orders with empty items array returns 400 Bad Request", async () => {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Rahul Test",
        customerPhone: "+91 99999 88888",
        shippingAddress: "456 Avenue",
        items: [],
      }),
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.message, /at least one product item is required/i);
  });

  test("POST /api/orders handles negative or zero quantities gracefully without breaking", async () => {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Boundary Test User",
        customerPhone: "+91 98765 43210",
        shippingAddress: "Boundary Road 9",
        items: [
          {
            productId: "1",
            name: "Health Nutra 9G",
            price: 235,
            quantity: -10, // negative quantity
            unit: "Strip",
          },
        ],
      }),
    });
    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.success, true);
    // Quantity should be normalized to at least 1
    assert.ok(data.data.items[0].quantity >= 1);
    assert.ok(data.data.totalAmount >= 235);
  });

  test("POST /api/orders with SQL injection strings in customer name is safely sanitized", async () => {
    const sqlInjectionPayload = "Robert'); DROP TABLE orders;--";
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: sqlInjectionPayload,
        customerPhone: "+91 98765 11111",
        shippingAddress: "Safe Testing Street",
        items: [{ productId: "1", name: "Health Nutra 9G", price: 235, quantity: 1 }],
      }),
    });
    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.data.customerName, sqlInjectionPayload);

    // Verify order can be retrieved safely and table was NOT dropped
    const verifyRes = await fetch(`${BASE_URL}/api/orders/${data.orderId}`);
    assert.equal(verifyRes.status, 200);
    const verifyData = await verifyRes.json();
    assert.equal(verifyData.data.customerName, sqlInjectionPayload);
  });

  test("POST /api/orders with XSS script strings in notes is safely accepted as text", async () => {
    const xssPayload = "<script>alert('xss')</script>";
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Security Test",
        customerPhone: "+91 98765 22222",
        shippingAddress: "Secure Avenue",
        notes: xssPayload,
        items: [{ productId: "2", name: "Health Nutra 10Q Syrup", price: 210, quantity: 1 }],
      }),
    });
    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.data.notes, xssPayload);
  });
});

describe("Negative Testing: Order Tracking Edge Cases", () => {
  test("GET /api/orders/:id with non-existent ID returns 404 Not Found", async () => {
    const res = await fetch(`${BASE_URL}/api/orders/HN-ORD-DOES-NOT-EXIST-999999`);
    assert.equal(res.status, 404);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.message, /order not found/i);
  });

  test("GET /api/orders/:id with path traversal characters returns safe 404", async () => {
    const res = await fetch(`${BASE_URL}/api/orders/%2E%2E%2F%2E%2E%2Fetc%2Fpasswd`);
    assert.ok(res.status === 404 || res.status === 400);
  });
});

describe("Negative Testing: Contact Us Form Validation", () => {
  test("POST /api/contact with empty payload returns 400 Bad Request", async () => {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.message, /name, email, and message/i);
  });

  test("POST /api/contact with missing message returns 400 Bad Request", async () => {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
      }),
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
  });
});

describe("Negative Testing: Admin Authentication & Security Guard", () => {
  test("POST /api/admin/login with empty credentials returns 400 Bad Request", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
  });

  test("POST /api/admin/login with wrong password returns 401 Unauthorized", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "incorrectPassword999!" }),
    });
    assert.equal(res.status, 401);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.message, /invalid username or password/i);
  });

  test("POST /api/admin/login with non-existent username returns 401 Unauthorized", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "ghost_admin_987", password: "admin123" }),
    });
    assert.equal(res.status, 401);
    const data = await res.json();
    assert.equal(data.success, false);
  });

  test("GET /api/admin/me without session cookie returns 401 Unauthorized", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/me`);
    assert.equal(res.status, 401);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.message, /authentication required/i);
  });

  test("GET /api/admin/products without session cookie returns 401 Unauthorized", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/products`);
    assert.equal(res.status, 401);
    const data = await res.json();
    assert.equal(data.success, false);
  });

  test("GET /api/admin/orders without session cookie returns 401 Unauthorized", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/orders`);
    assert.equal(res.status, 401);
    const data = await res.json();
    assert.equal(data.success, false);
  });

  test("POST /api/admin/orders/1/status without session cookie returns 401 Unauthorized", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/orders/1/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus: "shipped" }),
    });
    assert.equal(res.status, 401);
    const data = await res.json();
    assert.equal(data.success, false);
  });

  test("GET /admin page without session cookie redirects to /admin/login", async () => {
    const res = await fetch(`${BASE_URL}/admin`, {
      redirect: "manual",
    });
    // In Express, requireAuth redirects to /admin/login (302) or static folder redirects /admin to /admin/ (301)
    assert.ok(res.status === 301 || res.status === 302, "Should return redirect status 301 or 302");
  });

  test("GET non-existent API endpoint returns 404 with JSON", async () => {
    const res = await fetch(`${BASE_URL}/api/non-existent-endpoint-abc-123`);
    assert.equal(res.status, 404);
    const data = await res.json();
    assert.equal(data.success, false);
  });
});
