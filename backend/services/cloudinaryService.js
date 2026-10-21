import { v2 as cloudinary } from "cloudinary";

/**
 * Health Nutra - Cloudinary Media Storage Service
 * Provides permanent, high-performance CDN image storage and transformation
 * for product formulations and brand assets (logo, banners).
 *
 * Reads credentials securely from environment variables:
 * - CLOUDINARY_CLOUD_NAME (default: "usqwgkl7")
 * - CLOUDINARY_API_KEY    (default: "173632714251558")
 * - CLOUDINARY_API_SECRET (from process.env)
 * - CLOUDINARY_URL        (optional alternative connection string)
 * - BRAND_LOGO_URL / CLOUDINARY_LOGO_URL (brand logo URL from env)
 */

/**
 * Checks if Cloudinary credentials are fully provided in the environment
 * @returns {boolean}
 */
export function isCloudinaryConfigured() {
  if (process.env.CLOUDINARY_URL && process.env.CLOUDINARY_URL.trim().length > 0) {
    return true;
  }
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "usqwgkl7";
  const apiKey = process.env.CLOUDINARY_API_KEY || "173632714251558";
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  return Boolean(
    cloudName &&
    apiKey &&
    apiSecret &&
    apiSecret.trim().length > 0 &&
    !apiSecret.includes("<your_api_secret>")
  );
}

/**
 * Ensure Cloudinary client is configured with latest environment variables
 */
export function configureCloudinary() {
  if (!isCloudinaryConfigured()) return false;

  if (process.env.CLOUDINARY_URL) {
    cloudinary.config();
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "usqwgkl7",
      api_key: process.env.CLOUDINARY_API_KEY || "173632714251558",
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
  return true;
}

/**
 * Upload an image (file path, remote URL, or base64) to Cloudinary
 * Applies automatic WebP/AVIF format and lossless quality optimization.
 *
 * @param {string} fileInput - Local file path, URL, or data URI
 * @param {object} [options={}] - Additional Cloudinary upload options
 * @returns {Promise<{ success: boolean, url: string, public_id: string, width: number, height: number, format: string, bytes: number }>}
 */
export async function uploadImage(fileInput, options = {}) {
  if (!configureCloudinary()) {
    throw new Error("Cloudinary credentials are not configured. Set CLOUDINARY_API_SECRET in .env");
  }

  const uploadOptions = {
    folder: options.folder || "health-nutra/products",
    resource_type: "image",
    overwrite: options.overwrite || false,
    ...options,
  };

  const result = await cloudinary.uploader.upload(fileInput, uploadOptions);

  // Generate delivery-optimized URL with auto-format and auto-quality
  const optimizedUrl = cloudinary.url(result.public_id, {
    fetch_format: "auto",
    quality: "auto",
    secure: true,
  });

  return {
    success: true,
    url: optimizedUrl || result.secure_url,
    secure_url: result.secure_url,
    public_id: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}

/**
 * Generate an auto-cropped square thumbnail URL for product cards
 *
 * @param {string} publicId - Cloudinary asset public ID
 * @param {number} [width=500]
 * @param {number} [height=500]
 * @returns {string}
 */
export function getAutoCropUrl(publicId, width = 500, height = 500) {
  if (!configureCloudinary()) return "";
  return cloudinary.url(publicId, {
    crop: "auto",
    gravity: "auto",
    width,
    height,
    fetch_format: "auto",
    quality: "auto",
    secure: true,
  });
}

/**
 * Generate an optimized delivery URL for a given public ID
 *
 * @param {string} publicId - Cloudinary asset public ID
 * @param {object} [transforms={}]
 * @returns {string}
 */
export function getOptimizedUrl(publicId, transforms = {}) {
  if (!configureCloudinary()) return "";
  return cloudinary.url(publicId, {
    fetch_format: "auto",
    quality: "auto",
    secure: true,
    ...transforms,
  });
}

/**
 * Extracts the Cloudinary public_id from a full Cloudinary URL
 * Example: https://res.cloudinary.com/usqwgkl7/image/upload/v1713600000/health-nutra/products/abc.webp
 * -> health-nutra/products/abc
 *
 * @param {string} url - Full Cloudinary URL or public ID
 * @returns {string|null}
 */
export function extractPublicId(url) {
  if (!url || typeof url !== "string") return null;
  if (!url.startsWith("http")) return url; // Already a public_id

  try {
    const uploadIdx = url.indexOf("/upload/");
    if (uploadIdx === -1) return null;

    let pathPart = url.substring(uploadIdx + 8);
    // Strip leading transformations and version prefixes (e.g. f_auto,q_auto/v1713600000/)
    pathPart = pathPart.replace(/^(?:(?:[a-z]{1,2}_[^/]+|v\d+)\/)+/, "");

    // Remove file extension
    const lastDot = pathPart.lastIndexOf(".");
    if (lastDot !== -1) {
      pathPart = pathPart.substring(0, lastDot);
    }
    return pathPart;
  } catch {
    return null;
  }
}

/**
 * Checks if a given image path is a Cloudinary-hosted URL
 * @param {string} url
 * @returns {boolean}
 */
export function isCloudinaryUrl(url) {
  if (!url || typeof url !== "string") return false;
  return url.includes("res.cloudinary.com") || url.includes("cloudinary.com");
}

/**
 * Delete an image asset from Cloudinary by its public ID or full URL
 *
 * @param {string} publicIdOrUrl
 * @returns {Promise<{ success: boolean, result?: any, message?: string }>}
 */
export async function deleteImage(publicIdOrUrl) {
  if (!configureCloudinary()) {
    return { success: false, message: "Cloudinary not configured" };
  }

  const publicId = extractPublicId(publicIdOrUrl);
  if (!publicId) {
    return { success: false, message: "Invalid Cloudinary public ID" };
  }

  try {
    const res = await cloudinary.uploader.destroy(publicId, { invalidate: true });
    return { success: res.result === "ok", result: res };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Retrieve the Brand Logo URL configured from environment variables
 * Reads in order of precedence:
 * 1. process.env.BRAND_LOGO_URL
 * 2. process.env.CLOUDINARY_LOGO_URL
 * 3. Default Cloudinary asset URL if configured
 *
 * @returns {string}
 */
export function getBrandLogoUrl() {
  if (process.env.BRAND_LOGO_URL && process.env.BRAND_LOGO_URL.trim().length > 0) {
    return process.env.BRAND_LOGO_URL.trim();
  }
  if (process.env.CLOUDINARY_LOGO_URL && process.env.CLOUDINARY_LOGO_URL.trim().length > 0) {
    return process.env.CLOUDINARY_LOGO_URL.trim();
  }
  if (process.env.CLOUDINARY_LOGO_PUBLIC_ID && isCloudinaryConfigured()) {
    return getOptimizedUrl(process.env.CLOUDINARY_LOGO_PUBLIC_ID);
  }
  return "";
}

export default {
  isCloudinaryConfigured,
  configureCloudinary,
  uploadImage,
  deleteImage,
  getAutoCropUrl,
  getOptimizedUrl,
  extractPublicId,
  isCloudinaryUrl,
  getBrandLogoUrl,
};
