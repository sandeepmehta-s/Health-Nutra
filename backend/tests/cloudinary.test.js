import { describe, test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  isCloudinaryConfigured,
  configureCloudinary,
  extractPublicId,
  isCloudinaryUrl,
  getBrandLogoUrl,
  getOptimizedUrl,
  getAutoCropUrl,
} from "../services/cloudinaryService.js";

const BASE_URL = process.env.TEST_API_URL || process.env.TEST_APP_URL || "http://localhost:5000";

describe("Cloudinary Service & Environment Configuration", () => {
  const origEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...origEnv };
  });

  test("isCloudinaryConfigured returns false when secret is missing or placeholder", () => {
    delete process.env.CLOUDINARY_API_SECRET;
    delete process.env.CLOUDINARY_URL;
    assert.equal(isCloudinaryConfigured(), false);

    process.env.CLOUDINARY_API_SECRET = "<your_api_secret>";
    assert.equal(isCloudinaryConfigured(), false);

    process.env.CLOUDINARY_API_SECRET = "   ";
    assert.equal(isCloudinaryConfigured(), false);
  });

  test("isCloudinaryConfigured returns true when valid secret is configured", () => {
    process.env.CLOUDINARY_CLOUD_NAME = "usqwgkl7";
    process.env.CLOUDINARY_API_KEY = "173632714251558";
    process.env.CLOUDINARY_API_SECRET = "test_actual_secret_xyz123";
    assert.equal(isCloudinaryConfigured(), true);
  });

  test("isCloudinaryConfigured returns true with CLOUDINARY_URL", () => {
    process.env.CLOUDINARY_URL = "cloudinary://173632714251558:test_secret@usqwgkl7";
    assert.equal(isCloudinaryConfigured(), true);
  });

  test("extractPublicId accurately parses various Cloudinary URL formats", () => {
    // Standard URL with version and folder
    const url1 = "https://res.cloudinary.com/usqwgkl7/image/upload/v1713600000/health-nutra/products/shoes.jpg";
    assert.equal(extractPublicId(url1), "health-nutra/products/shoes");

    // URL with transformation flags
    const url2 = "https://res.cloudinary.com/usqwgkl7/image/upload/f_auto,q_auto/v1713600000/health-nutra/brand/logo.png";
    assert.equal(extractPublicId(url2), "health-nutra/brand/logo");

    // URL without version prefix
    const url3 = "https://res.cloudinary.com/usqwgkl7/image/upload/health-nutra/products/sample.webp";
    assert.equal(extractPublicId(url3), "health-nutra/products/sample");

    // Raw public ID
    assert.equal(extractPublicId("health-nutra/products/abc"), "health-nutra/products/abc");

    // Invalid / empty inputs
    assert.equal(extractPublicId(""), null);
    assert.equal(extractPublicId(null), null);
    assert.equal(extractPublicId("https://example.com/other-image.jpg"), null);
  });

  test("isCloudinaryUrl detects Cloudinary CDN domains correctly", () => {
    assert.equal(isCloudinaryUrl("https://res.cloudinary.com/usqwgkl7/image/upload/sample.jpg"), true);
    assert.equal(isCloudinaryUrl("https://cloudinary.com/images/test.png"), true);
    assert.equal(isCloudinaryUrl("/uploads/product-123.jpg"), false);
    assert.equal(isCloudinaryUrl("https://example.com/photo.jpg"), false);
    assert.equal(isCloudinaryUrl(""), false);
  });

  test("getBrandLogoUrl reads from environment credentials", () => {
    process.env.BRAND_LOGO_URL = "https://res.cloudinary.com/usqwgkl7/image/upload/brand-logo.png";
    assert.equal(getBrandLogoUrl(), "https://res.cloudinary.com/usqwgkl7/image/upload/brand-logo.png");

    delete process.env.BRAND_LOGO_URL;
    process.env.CLOUDINARY_LOGO_URL = "https://res.cloudinary.com/usqwgkl7/image/upload/cdn-logo.png";
    assert.equal(getBrandLogoUrl(), "https://res.cloudinary.com/usqwgkl7/image/upload/cdn-logo.png");

    delete process.env.CLOUDINARY_LOGO_URL;
    assert.equal(getBrandLogoUrl(), "");
  });

  test("URL transformation helpers generate valid Cloudinary delivery URLs", () => {
    process.env.CLOUDINARY_CLOUD_NAME = "usqwgkl7";
    process.env.CLOUDINARY_API_KEY = "173632714251558";
    process.env.CLOUDINARY_API_SECRET = "test_secret";

    const cropUrl = getAutoCropUrl("health-nutra/products/sample", 400, 400);
    assert.ok(cropUrl.includes("usqwgkl7"));
    assert.ok(cropUrl.includes("health-nutra/products/sample"));
    assert.ok(cropUrl.includes("c_auto") || cropUrl.includes("w_400"));

    const optUrl = getOptimizedUrl("health-nutra/products/sample");
    assert.ok(optUrl.includes("usqwgkl7"));
    assert.ok(optUrl.includes("f_auto") || optUrl.includes("health-nutra/products/sample"));
  });
});

describe("Admin Brand Logo Endpoint Security & Integration", () => {
  test("GET /api/admin/brand/logo without session cookie returns 401 Unauthorized", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/brand/logo`);
    assert.equal(res.status, 401, "Brand logo admin endpoint must require authentication");
    const json = await res.json();
    assert.equal(json.success, false);
  });

  test("POST /api/admin/brand/logo without session cookie returns 401 Unauthorized", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/brand/logo`, {
      method: "POST",
    });
    assert.equal(res.status, 401, "Brand logo upload must require authentication");
  });

  test("GET /api/config includes brand configuration and status", async () => {
    const res = await fetch(`${BASE_URL}/api/config`);
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.ok(json.success);
    assert.ok(typeof json.brand === "object");
    assert.ok("logoUrl" in json.brand);
    assert.ok("isCloudinaryConfigured" in json.brand);
  });
});
