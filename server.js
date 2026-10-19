import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { initDatabase } from "./backend/services/dbService.js";
import publicRoutes from "./backend/routes/publicRoutes.js";
import adminRoutes from "./backend/routes/adminRoutes.js";
import { requireAuth } from "./backend/middleware/auth.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors());

// Session Management
app.use(
  session({
    secret: process.env.SESSION_SECRET || "health-nutra-super-secret-key-987654",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true if running with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "lax",
    },
  })
);

// Serve static assets
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/images", express.static(path.join(__dirname, "public", "images")));
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

  app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🌿 HEALTH NUTRA - Fullstack Application Started`);
    console.log(`🗄️  Active Database Engine: ${dbType.toUpperCase()}`);
    console.log(`🚀 Public Website:         http://localhost:${PORT}/`);
    console.log(`🔐 Admin Panel:            http://localhost:${PORT}/admin`);
    console.log(`📦 Public API:             http://localhost:${PORT}/api/products`);
    console.log(`==================================================\n`);
  });
}

startServer();
