import { describe, test } from "node:test";
import assert from "node:assert/strict";

const BASE_URL = process.env.TEST_API_URL || process.env.TEST_APP_URL || "http://localhost:5000";

describe("Contact Form & Admin Enquiries Suite", () => {
  let adminCookie = "";
  let createdEnquiryId = "";

  test("Step 1: Admin logs in successfully and retrieves session cookie", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: process.env.ADMIN_USERNAME || "healthnutra16@gmail.com",
        password: process.env.ADMIN_PASSWORD || "2000@HNutra",
      }),
    });
    assert.equal(res.status, 200, "Admin login must return HTTP 200");
    const json = await res.json();
    assert.equal(json.success, true);
    adminCookie = res.headers.get("set-cookie") || "";
    assert.ok(adminCookie.includes("connect.sid"), "Must contain session cookie");
  });

  test("Step 2: POST /api/contact validates missing fields and bad inputs", async () => {
    // Missing name
    const r1 = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "doc@test.com", message: "Inquiry text" }),
    });
    assert.equal(r1.status, 400);

    // Invalid email
    const r2 = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Dr. Test", email: "not-an-email", message: "Inquiry text" }),
    });
    assert.equal(r2.status, 400);

    // Missing message
    const r3 = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Dr. Test", email: "doc@test.com", message: "" }),
    });
    assert.equal(r3.status, 400);
  });

  test("Step 3: POST /api/contact successfully saves valid enquiry to MongoDB", async () => {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        phone: "+91 99887 76655",
        subject: "Bulk Order & Dealership",
        message: "We need 200 units of Health Nutra 9G for our clinic dispensary.",
      }),
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(json.message.includes("received"));
  });

  test("Step 4: Unauthenticated access to /api/admin/enquiries is blocked", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/enquiries`);
    assert.equal(res.status, 401, "Unauthenticated request must be rejected with 401");
  });

  test("Step 5: Authenticated GET /api/admin/enquiries returns paginated list and counts", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/enquiries`, {
      headers: { cookie: adminCookie },
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(Array.isArray(json.data), "data must be an array");
    assert.ok(json.stats, "Must include stats summary");
    assert.ok(json.stats.total >= 1, "Must have at least 1 enquiry");

    const found = json.data.find((e) => e.email === "aarav.sharma@example.com");
    assert.ok(found, "Saved enquiry must exist in admin list");
    assert.equal(found.status, "new");
    createdEnquiryId = found.id || found._id;
  });

  test("Step 6: PATCH /api/admin/enquiries/:id/status updates status with validation", async () => {
    assert.ok(createdEnquiryId, "Must have an enquiry ID to update");

    // Invalid status rejected
    const badRes = await fetch(`${BASE_URL}/api/admin/enquiries/${createdEnquiryId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", cookie: adminCookie },
      body: JSON.stringify({ status: "bogus-status" }),
    });
    assert.equal(badRes.status, 400);

    // Valid status: contacted
    const okRes = await fetch(`${BASE_URL}/api/admin/enquiries/${createdEnquiryId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", cookie: adminCookie },
      body: JSON.stringify({ status: "contacted" }),
    });
    assert.equal(okRes.status, 200);
    const okJson = await okRes.json();
    assert.equal(okJson.success, true);
    assert.equal(okJson.data.status, "contacted");
  });

  test("Step 7: GET /api/admin/enquiries/export downloads valid CSV spreadsheet", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/enquiries/export`, {
      headers: { cookie: adminCookie },
    });
    assert.equal(res.status, 200);
    assert.ok(res.headers.get("content-type").includes("text/csv"));
    assert.ok(res.headers.get("content-disposition").includes("attachment; filename="));

    const csvText = await res.text();
    const lines = csvText.trim().split("\r\n");
    assert.ok(lines.length >= 2, "CSV must contain header and at least 1 record");
    assert.equal(lines[0], "ID,Date,Name,Email,Phone,Subject,Status,Message");
    assert.ok(csvText.includes("Aarav Sharma"));
  });

  test("Step 8: DELETE /api/admin/enquiries/:id removes enquiry cleanly", async () => {
    assert.ok(createdEnquiryId, "Must have an enquiry ID to delete");
    const delRes = await fetch(`${BASE_URL}/api/admin/enquiries/${createdEnquiryId}`, {
      method: "DELETE",
      headers: { cookie: adminCookie },
    });
    assert.equal(delRes.status, 200);
    const delJson = await delRes.json();
    assert.equal(delJson.success, true);
  });
});

