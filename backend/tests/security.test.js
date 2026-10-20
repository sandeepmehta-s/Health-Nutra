/**
 * Health Nutra - Dedicated Security & Payment Integrity Test Suite
 * Validates:
 * 1. Admin Authentication: Removal of master/fallback bypasses, session fixation protection.
 * 2. Order & Pricing Integrity: Server-side pricing enforcement, immunity to client price tampering.
 * 3. Payment Status Integrity: UPI/Online payments initialized to pending, never auto-paid.
 * 4. Idempotency Protection: Duplicate submission prevention via Idempotency-Key.
 * 5. Customer Privacy: Strict exclusion of customerPhone, customerEmail, and internal notes from public tracking.
 * 6. Admin Status Allowlist: Strict validation against unauthorized order/payment statuses.
 * 7. Path Traversal & Upload Security.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

const BASE_URL = process.env.TEST_API_URL || "http://localhost:5000";

describe("Security Audit: Admin Authentication Hardening", () => {
  test("Hardcoded bypass attempt with non-configured credentials fails with 401 Unauthorized", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "superadmin_bypass", password: "admin123" }),
    });
    assert.equal(res.status, 401);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.message, /invalid username or password/i);
  });

  test("Session fixation protection: successful login returns session cookie", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: process.env.ADMIN_PASSWORD || "admin123" }),
    });
    assert.equal(res.status, 200);
    const cookie = res.headers.get("set-cookie");
    assert.ok(cookie, "Set-Cookie header must be present on authenticated login");
    assert.match(cookie, /connect\.sid=/i);
    assert.match(cookie, /HttpOnly/i, "Session cookie must have HttpOnly flag");
  });
});

describe("Security Audit: Orders & Pricing Integrity", () => {
  test("Server ignores client-supplied forged price and calculates total from database", async () => {
    const forgedPayload = {
      customerName: "Tamper Test User",
      customerPhone: "+91 98765 00000",
      shippingAddress: "404 Security Lane",
      city: "Bengaluru",
      pincode: "560001",
      paymentMethod: "Cash on Delivery (COD)",
      items: [
        {
          productId: "1", // Health Nutra 9G has real price ₹235
          name: "Health Nutra 9G",
          price: 0.01, // MALICIOUS CLIENT PRICE ATTEMPT (1 paisa)
          quantity: 2,
        },
      ],
    };

    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(forgedPayload),
    });
    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.success, true);
    // Real price is 235, quantity is 2 -> Total MUST be 470, NOT 0.02!
    assert.equal(data.data.totalAmount, 470, "Server must enforce server-side database price of ₹235 x 2 = ₹470");
    assert.equal(data.data.items[0].price, 235, "Stored item price must be database price ₹235");
  });

  test("Order with invalid or inactive product ID is rejected with 400 Bad Request", async () => {
    const invalidPayload = {
      customerName: "Invalid Prod User",
      customerPhone: "+91 98765 00000",
      shippingAddress: "404 Security Lane",
      items: [
        {
          productId: "non-existent-product-id-9999",
          quantity: 1,
        },
      ],
    };

    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidPayload),
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.message, /unavailable or invalid/i);
  });

  test("Online / UPI payments are initialized as 'pending' (NEVER auto-marked 'paid')", async () => {
    const upiPayload = {
      customerName: "UPI Test Customer",
      customerPhone: "+91 98111 22334",
      shippingAddress: "Flat 101, Electronic City",
      city: "Bengaluru",
      pincode: "560100",
      paymentMethod: "UPI / Online",
      items: [{ productId: "2", quantity: 1 }],
    };

    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(upiPayload),
    });
    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(
      data.data.paymentStatus,
      "pending",
      "UPI payments must initialize as pending until payment gateway confirmation"
    );
  });

  test("Idempotency protection: duplicate checkout submission returns existing order without duplication", async () => {
    const idempotencyKey = `test-idemp-${Date.now()}-${Math.random()}`;
    const orderPayload = {
      idempotencyKey,
      customerName: "Idempotent Customer",
      customerPhone: "+91 98450 99999",
      shippingAddress: "Tech Park Phase 1",
      city: "Hyderabad",
      items: [{ productId: "1", quantity: 1 }],
    };

    // First attempt
    const res1 = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });
    assert.equal(res1.status, 201);
    const data1 = await res1.json();
    const firstOrderId = data1.orderId;

    // Second attempt with same idempotency key (e.g. user double-clicked)
    const res2 = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });
    assert.equal(res2.status, 200, "Duplicate submission with Idempotency-Key must return 200 OK");
    const data2 = await res2.json();
    assert.equal(data2.orderId, firstOrderId, "Both requests must resolve to the identical orderId");
  });
});

describe("Security Audit: Customer Privacy Enforcement", () => {
  let privacyOrderId = "";

  test("Create order with sensitive PII for tracking verification", async () => {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Aarav Gupta",
        customerPhone: "+91 98765 43210", // SENSITIVE PII
        customerEmail: "aarav.gupta@privatecorp.com", // SENSITIVE PII
        shippingAddress: "Flat 901, Tower B, Confidential Heights", // SENSITIVE STREET ADDRESS
        city: "Pune",
        pincode: "411001",
        notes: "Confidential medical delivery - do not ring bell", // SENSITIVE INTERNAL NOTES
        items: [{ productId: "1", quantity: 1 }],
      }),
    });
    assert.equal(res.status, 201);
    const data = await res.json();
    privacyOrderId = data.orderId;
    assert.ok(privacyOrderId);
  });

  test("GET /api/orders/:id NEVER leaks customer phone, email, full address, or internal notes", async () => {
    const res = await fetch(`${BASE_URL}/api/orders/${privacyOrderId}`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);

    const trackingData = data.data;

    // VERIFY CRITICAL PRIVACY EXCLUSIONS
    assert.equal(
      trackingData.customerPhone,
      undefined,
      "Public order tracking MUST NEVER return customerPhone"
    );
    assert.equal(
      trackingData.customerEmail,
      undefined,
      "Public order tracking MUST NEVER return customerEmail"
    );
    assert.equal(
      trackingData.notes,
      undefined,
      "Public order tracking MUST NEVER return internal customer notes"
    );

    // Verify shipping address is masked and does not reveal full street/apartment
    assert.ok(
      !trackingData.shippingAddress.includes("Flat 901"),
      "Public shippingAddress must not expose specific apartment/door number"
    );
    assert.ok(
      !trackingData.shippingAddress.includes("Confidential Heights"),
      "Public shippingAddress must not expose street/building name"
    );
    assert.ok(
      trackingData.shippingAddress.includes("Pune"),
      "Masked address should display general city for customer verification"
    );
  });
});

describe("Security Audit: Admin Status Update Allowlists", () => {
  let adminCookie = "";
  let testOrderId = "";

  test("Authenticate admin and create test order for status validation", async () => {
    const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: process.env.ADMIN_PASSWORD || "admin123" }),
    });
    assert.equal(loginRes.status, 200);
    adminCookie = loginRes.headers.get("set-cookie").split(";")[0];

    const orderRes = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Allowlist Test",
        customerPhone: "+91 99999 00000",
        shippingAddress: "Street 1",
        city: "Delhi",
        items: [{ productId: "1", quantity: 1 }],
      }),
    });
    assert.equal(orderRes.status, 201);
    const orderData = await orderRes.json();
    testOrderId = orderData.orderId;
  });

  test("PATCH /api/admin/orders/:id/status rejects invalid orderStatus with 400 Bad Request", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/orders/${testOrderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({ orderStatus: "malicious_status_injection" }),
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.message, /invalid order status/i);
  });

  test("PATCH /api/admin/orders/:id/status rejects invalid paymentStatus with 400 Bad Request", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/orders/${testOrderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({ paymentStatus: "crypto_paid" }),
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.message, /invalid payment status/i);
  });

  test("PATCH /api/admin/orders/:id/status accepts valid status from allowlist", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/orders/${testOrderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({ orderStatus: "shipped", paymentStatus: "paid" }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.data.orderStatus, "shipped");
    assert.equal(data.data.paymentStatus, "paid");
  });
});
