import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { initDatabase } from "./backend/services/dbService.js";
import { startKeepAliveCron } from "./backend/services/cronService.js";
import publicRoutes from "./backend/routes/publicRoutes.js";
import adminRoutes from "./backend/routes/adminRoutes.js";
import { requireAuth } from "./backend/middleware/auth.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

// Enable trust proxy for cloud deployments (Render, Railway, Heroku, Cloudflare, Nginx)
// This is essential so express-rate-limit and secure session cookies work properly behind reverse proxies.
app.set("trust proxy", 1);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS with credentials support for deployments
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Session Management (configured for both local development and HTTPS production deployments)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "health-nutra-super-secret-key-987654",
    resave: false,
    saveUninitialized: false,
    proxy: true, // required for reverse proxies
    cookie: {
      httpOnly: true,
      secure: "auto", // Automatically detects HTTPS via trust proxy
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "lax",
    },
  })
);

// Health & Keep-Alive Ping Endpoints
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString(), uptime: process.uptime() });
});

app.get("/api/ping", (req, res) => {
  res.json({ success: true, message: "pong", timestamp: new Date().toISOString() });
});

// Serve static assets from uploads, images, frontend, and public
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/images", express.static(path.join(__dirname, "public", "images")));
app.use("/frontend", express.static(path.join(__dirname, "frontend")));
app.use(express.static(path.join(__dirname, "frontend")));
app.use(express.static(path.join(__dirname, "public")));

// API Endpoints
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

// Admin Web Pages
app.get("/admin/login", (req, res) => {
  if (req.session && req.session.adminId) {
    return res.redirect("/admin");
  }
  res.sendFile(path.join(__dirname, "public", "admin", "login.html"));
});

app.get("/admin", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin", "admin.html"));
});

// Root public landing page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Fallback 404
app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ success: false, message: "API endpoint not found" });
  }
  res.status(404).sendFile(path.join(__dirname, "public", "index.html"));
});

// Start Server
async function startServer() {
  const dbType = await initDatabase();

  app.listen(PORT, HOST, () => {
    console.log(`\n==================================================`);
    console.log(`🌿 HEALTH NUTRA - Fullstack Application Started`);
    console.log(`🗄️  Active Database Engine: ${dbType.toUpperCase()}`);
    console.log(`🚀 Public Website:         http://localhost:${PORT}/`);
    console.log(`🔐 Admin Panel:            http://localhost:${PORT}/admin`);
    console.log(`📦 Public API:             http://localhost:${PORT}/api/products`);
    console.log(`💓 Health Check:           http://localhost:${PORT}/health`);
    console.log(`==================================================\n`);

    // Start 5-minute Keep-Alive Cron job
    startKeepAliveCron(PORT);
  });
}

startServer();

