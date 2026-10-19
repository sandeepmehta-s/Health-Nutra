export function requireAuth(req, res, next) {
  if (req.session && req.session.adminId) {
    return next();
  }

  // If API request, return JSON 401
  const isApi =
    (req.originalUrl && req.originalUrl.startsWith("/api/")) ||
    (req.baseUrl && req.baseUrl.startsWith("/api")) ||
    (req.path && req.path.startsWith("/api/")) ||
    req.xhr ||
    (req.headers.accept && req.headers.accept.includes("application/json"));

  if (isApi) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please log in.",
    });
  }

  // Otherwise redirect to admin login page
  return res.redirect("/admin/login");
}
