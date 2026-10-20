import express from "express";
import session from "express-session";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { initDatabase } from "./services/dbService.js";
import { startKeepAliveCron } from "./services/cronService.js";
import publicRoutes from "./routes/publicRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { requireAuth } from "./middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env or root .env
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
const rawAppUrl = process.env.APP_URL;
const isLocalAppUrl = !rawAppUrl || rawAppUrl.includes("localhost") || rawAppUrl.includes("127.0.0.1");
const APP_URL = (
  process.env.RENDER_EXTERNAL_URL ||
  (!isLocalAppUrl ? rawAppUrl : null) ||
  rawAppUrl ||
  `http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}`
).replace(/\/$/, "");
const API_URL = (
  (process.env.RENDER_EXTERNAL_URL ? `${process.env.RENDER_EXTERNAL_URL.replace(/\/$/, "")}/api` : null) ||
  (process.env.API_URL && !process.env.API_URL.includes("localhost") ? process.env.API_URL : null) ||
  `${APP_URL}/api`
).replace(/\/$/, "");

// Enable trust proxy for cloud deployments (Render, Railway, Heroku, Cloudflare, Nginx)
app.set("trust proxy", 1);

// ── Security headers (helmet) ─────────────────────────────────
// Relaxed CSP so the single-file React frontend (inline scripts + CDN)
// can still load.  Tighten per-script when migrating to bundled build.
app.use(
  helmet({
    contentSecurityPolicy: false, // frontend uses inline JSX/Babel — enable after build step
    crossOriginEmbedderPolicy: false,
  })
);

// ── HTTP response compression ─────────────────────────────────
// Skips already-compressed assets (images) and short responses (<1 KB)
app.use(compression());

// Body parser
app.use(express.json({ limit: "256kb" }));
app.use(express.urlencoded({ extended: true, limit: "256kb" }));

// CORS with credentials support
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Session Management
app.use(
  session({
    secret: process.env.SESSION_SECRET || "health-nutra-super-secret-key-987654",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: "auto",
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

// App & API Configuration Endpoint
app.get("/api/config", (req, res) => {
  res.json({
    success: true,
    appUrl: APP_URL,
    apiUrl: API_URL,
    pingIntervalMinutes: parseInt(process.env.PING_INTERVAL_MINUTES || "5", 10),
  });
});

// Paths to backend uploads and frontend static assets
const uploadsDir = path.join(__dirname, "uploads");
const frontendDir = path.join(__dirname, "..", "frontend");
const imagesDir = path.join(frontendDir, "images");

// Ensure .jsx and .js are always served with application/javascript for browser ES modules
app.use((req, res, next) => {
  if (req.path.endsWith(".jsx") || req.path.endsWith(".js") || req.path.endsWith(".mjs")) {
    res.type("application/javascript");
  }
  next();
});

// Static assets — long-lived cache for images/uploads, short for HTML
app.use("/uploads", express.static(uploadsDir, { maxAge: "7d", etag: true }));
app.use("/images", express.static(imagesDir, { maxAge: "7d", etag: true }));
app.use("/js", express.static(frontendDir, { maxAge: "1h", etag: true })); // Alias /js to frontend folder so /js/main.js never 404s
app.use(express.static(frontendDir, { maxAge: "10m", etag: true }));

// Fallback for /js/:file in case of legacy cached requests
app.get("/js/:filename", (req, res, next) => {
  const filePath = path.join(frontendDir, req.params.filename);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  next();
});

// API Endpoints
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

// Admin Web Pages
app.get("/admin/login", (req, res) => {
  if (req.session && req.session.adminId) {
    return res.redirect("/admin");
  }
  res.sendFile(path.join(frontendDir, "admin", "login.html"));
});

app.get("/admin", requireAuth, (req, res) => {
  res.sendFile(path.join(frontendDir, "admin", "admin.html"));
});

// Root public landing page
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

// Fallback 404
app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ success: false, message: "API endpoint not found" });
  }
  res.status(404).sendFile(path.join(frontendDir, "index.html"));
});

// Start Server
async function startServer() {
  const dbType = await initDatabase();

  app.listen(PORT, HOST, () => {
    console.log(`\n==================================================`);
    console.log(`🌿 HEALTH NUTRA - Fullstack Application Started`);
    console.log(`🗄️  Active Database Engine: ${dbType.toUpperCase()}`);
    console.log(`📱 Public Website:         ${APP_URL}/`);
    console.log(`🔐 Admin Panel:            ${APP_URL}/admin`);
    console.log(`📦 Public API:             ${API_URL}/products`);
    console.log(`💓 Health Check:           ${APP_URL}/health`);
    console.log(`==================================================\n`);

    // Start 5-minute Keep-Alive Cron job
    startKeepAliveCron(PORT);
  });
}

startServer();
