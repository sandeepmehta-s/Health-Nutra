import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { initDatabase } from "./services/dbService.js";
import { startKeepAliveCron } from "./services/cronService.js";
import { getBrandLogoUrl, isCloudinaryConfigured } from "./services/cloudinaryService.js";
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
  (!isLocalAppUrl ? rawAppUrl : null) ||
  (process.env.RENDER || process.env.NODE_ENV === "production" ? "https://healthnutra.co.in" : null) ||
  process.env.RENDER_EXTERNAL_URL ||
  "https://healthnutra.co.in"
).replace(/\/$/, "");
const API_URL = `${APP_URL}/api`;

// Enable trust proxy for cloud deployments (Render, Railway, Heroku, Cloudflare, Nginx)
app.set("trust proxy", 1);

// ── Security headers (helmet) ─────────────────────────────────
// CSP configured to allow necessary frontend assets, CDNs, and Google Fonts
// while strictly disallowing unauthorized object embeds and frame-ancestors
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://unpkg.com",
          "https://cdn.tailwindcss.com",
          "https://cdnjs.cloudflare.com",
        ],
        scriptSrcAttr: ["'unsafe-inline'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://cdn.tailwindcss.com",
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        connectSrc: [
          "'self'",
          APP_URL,
          API_URL,
          "https://healthnutra.co.in",
          "https://www.healthnutra.co.in",
          "https://healthnutra.onrender.com",
          "https://health-nutra.onrender.com",
          "https://unpkg.com",
          "https://cdnjs.cloudflare.com",
          "https://cdn.tailwindcss.com",
        ],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: process.env.NODE_ENV === "production" ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// ── HTTP response compression ─────────────────────────────────
// Skips already-compressed assets (images) and short responses (<1 KB)
app.use(compression());

// Body parser with strict size limit to prevent memory-exhaustion DoS
app.use(express.json({ limit: "256kb" }));
app.use(express.urlencoded({ extended: true, limit: "256kb" }));

// ── Approved CORS Origin Policy ───────────────────────────────
// Reflects incoming origin and allows credentials, completely eliminating CORS blockages across custom domains
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Idempotency-Key"],
  })
);

// Session Management with secure production cookies and persistent MongoDB store
const isProduction = process.env.NODE_ENV === "production";
if (isProduction && !process.env.SESSION_SECRET) {
  console.warn("[Security Notice] SESSION_SECRET not set in environment! Set a strong secret in production.");
}

const mongoUri =
  process.env.MONGODB_URI ||
  "mongodb+srv://healthnutra16_db_user:xBLTmExrXqSejMKj@healthnutra.i5aemfd.mongodb.net/health_nutra?retryWrites=true&w=majority";

// Persistent MongoDB session store prevents memory leaks and ensures scalable sessions on Render
const sessionStore = MongoStore.create({
  mongoUrl: mongoUri,
  ttl: 7 * 24 * 60 * 60, // 7 days
  autoRemove: "native",
  touchAfter: 24 * 3600,
  crypto: {
    secret: process.env.SESSION_SECRET || "health-nutra-super-secret-key-987654",
  },
});

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || "health-nutra-super-secret-key-987654",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: isProduction ? true : "auto",
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
    brand: {
      logoUrl: getBrandLogoUrl(),
      isCloudinaryConfigured: isCloudinaryConfigured(),
    },
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

// Admin & Storefront Web Page Handlers (Registered before generic static directory to avoid 301 trailing-slash redirects)
app.get("/admin/login", (req, res) => {
  if (req.session && req.session.adminId) {
    return res.redirect("/admin");
  }
  res.sendFile(path.join(frontendDir, "admin", "login.html"));
});

app.get(["/admin", "/admin/"], requireAuth, (req, res) => {
  res.sendFile(path.join(frontendDir, "admin", "admin.html"));
});

// Root public landing page
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

// Static assets — long-lived cache for images/uploads, revalidate for code
app.use("/uploads", express.static(uploadsDir, { maxAge: "7d", etag: true }));
app.use("/images", express.static(imagesDir, { maxAge: "7d", etag: true }));
app.use("/js", express.static(frontendDir, { maxAge: "1h", etag: true })); // Alias /js to frontend folder so /js/main.js never 404s
app.use(
  express.static(frontendDir, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".html") || filePath.endsWith(".jsx") || filePath.endsWith(".js")) {
        res.setHeader("Cache-Control", "no-cache, must-revalidate");
      }
    },
  })
);

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

// Direct Public Page Routes (SPA Routing)
app.get(
  [
    "/about-us",
    "/about-us/",
    "/products",
    "/products/",
    "/product",
    "/product/:id",
    "/products/:id",
    "/contact-us",
    "/contact-us/",
    "/contact",
    "/contact/",
    "/privacy-policy",
    "/privacy-policy/",
    "/privacy",
    "/privacy/",
    "/terms-and-conditions",
    "/terms-and-conditions/",
    "/terms",
    "/terms/",
    "/terms-of-supply",
    "/terms-of-supply/",
  ],
  (req, res) => {
    res.sendFile(path.join(frontendDir, "index.html"));
  }
);

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
