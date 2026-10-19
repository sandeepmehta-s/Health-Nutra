import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
import { DatabaseSync } from "node:sqlite";
import { Product } from "../models/Product.js";
import { Admin } from "../models/Admin.js";

let useMongo = false;
let sqliteDb = null;

const STARTER_PRODUCTS = [
  {
    name: "Health Nutra 9G",
    category: "Multivitamin",
    shortDescription: "Complete daily nutrition with vitamins & minerals.",
    fullDescription:
      "Multivitamin, multimineral & antioxidant tablets formulated with 9 essential vitality blends. 10 x 10 tablets. Take one tablet daily after meals or as advised by your healthcare professional.",
    price: 235,
    unit: "Strip",
    image: "/uploads/9g.png",
    status: "active",
  },
  {
    name: "Health Nutra 10Q Syrup",
    category: "Syrup",
    shortDescription: "Energy booster syrup with CoQ10 & antioxidants for daily vitality.",
    fullDescription:
      "200ml multivitamin, CoQ10 & antioxidant syrup. Helps combat fatigue, support cardiac health, and revitalize natural stamina. Shake well before use.",
    price: 210,
    unit: "200ml",
    image: "/uploads/10q.png",
    status: "active",
  },
  {
    name: "Omega-3 Capsules",
    category: "Omega-3",
    shortDescription: "Supports heart, brain, joint, and cardiovascular wellness.",
    fullDescription:
      "Ultra-strength molecularly distilled fish oil softgels providing 1000mg EPA/DHA. Supports clear focus, cardiovascular circulation, and joint flexibility.",
    price: 499,
    unit: "Strip",
    image: "/uploads/omega3.png",
    status: "active",
  },
  {
    name: "Green Tea Extract",
    category: "Green Tea",
    shortDescription: "Standardised 50% EGCG capsules for metabolism & antioxidant support.",
    fullDescription:
      "Standardised green tea botanical extract rich in natural polyphenols and 50% EGCG. Promotes healthy metabolic rate, gentle weight balance, and antioxidant protection.",
    price: 299,
    unit: "Box",
    image: "/uploads/greentea.png",
    status: "active",
  },
];

// -------------------------------------------------------------
// Database Initialization
// -------------------------------------------------------------
export async function initDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  // Disable command buffering so queries don't hang if Mongo isn't connected
  mongoose.set("bufferCommands", false);

  if (mongoUri && !mongoUri.includes("127.0.0.1:27017") && !mongoUri.includes("localhost:27017")) {
    // Attempt MongoDB connection (e.g. Atlas or remote)
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
      useMongo = true;
      console.log(`[Database] Connected to MongoDB at: ${mongoose.connection.host}`);
      await seedMongo();
      return "mongodb";
    } catch (err) {
      console.warn(`[Database] Could not connect to remote MongoDB: ${err.message}`);
      await mongoose.disconnect().catch(() => {});
      useMongo = false;
    }
  } else {
    // Attempt local MongoDB with quick timeout
    try {
      await mongoose.connect(mongoUri || "mongodb://127.0.0.1:27017/health_nutra", {
        serverSelectionTimeoutMS: 1500,
      });
      useMongo = true;
      console.log(`[Database] Connected to MongoDB locally: ${mongoose.connection.host}`);
      await seedMongo();
      return "mongodb";
    } catch {
      // Local MongoDB service not active, fallback smoothly to SQLite
      await mongoose.disconnect().catch(() => {});
      useMongo = false;
    }
  }

  // SQLite Initialization
  console.log(`[Database] Notice: MongoDB local service not active.`);
  console.log(`[Database] Automatically utilizing zero-config embedded SQLite storage (health_nutra.sqlite).`);
  console.log(`[Database] (To switch to MongoDB, start mongod or paste your MongoDB Atlas URI in .env)`);

  const dbPath = path.resolve(process.cwd(), "health_nutra.sqlite");
  sqliteDb = new DatabaseSync(dbPath);

  // Create tables
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      shortDescription TEXT NOT NULL,
      fullDescription TEXT,
      price REAL NOT NULL,
      unit TEXT DEFAULT 'Strip',
      image TEXT DEFAULT '/uploads/9g.png',
      status TEXT DEFAULT 'active',
      createdAt TEXT,
      updatedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT DEFAULT 'Administrator',
      createdAt TEXT,
      updatedAt TEXT
    );
  `);

  await seedSQLite();
  return "sqlite";
}

// -------------------------------------------------------------
// Seeders
// -------------------------------------------------------------
async function seedMongo() {
  try {
    const u = (process.env.ADMIN_USERNAME || "admin").trim().toLowerCase();
    const p = process.env.ADMIN_PASSWORD || "admin123";

    let existingAdmin = await Admin.findOne({ username: u });
    if (!existingAdmin) {
      await new Admin({ username: u, password: p, name: "Health Nutra Administrator" }).save();
      console.log(`[Seed] Created default MongoDB admin: "${u}"`);
    } else {
      // Sync password if provided in env to allow seamless access on deploy
      existingAdmin.password = p;
      await existingAdmin.save();
      console.log(`[Seed] Synced MongoDB admin credentials for: "${u}"`);
    }

    const prodCount = await Product.countDocuments();
    if (prodCount === 0) {
      await Product.insertMany(STARTER_PRODUCTS);
      console.log(`[Seed] Seeded ${STARTER_PRODUCTS.length} starter products into MongoDB.`);
    }
  } catch (err) {
    console.error("[Seed Mongo]", err.message);
  }
}

async function seedSQLite() {
  try {
    const u = (process.env.ADMIN_USERNAME || "admin").trim().toLowerCase();
    const p = process.env.ADMIN_PASSWORD || "admin123";
    const hashed = await bcrypt.hash(p, 10);
    const now = new Date().toISOString();

    const existingAdmin = sqliteDb.prepare("SELECT * FROM admins WHERE username = ?").get(u);
    if (!existingAdmin) {
      const id = "admin-1";
      sqliteDb
        .prepare("INSERT INTO admins (id, username, password, name, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)")
        .run(id, u, hashed, "Health Nutra Administrator", now, now);
      console.log(`[Seed] Created default SQLite admin: "${u}"`);
    } else {
      // Update password hash to allow seamless admin access on deployment
      sqliteDb.prepare("UPDATE admins SET password = ?, updatedAt = ? WHERE username = ?").run(hashed, now, u);
      console.log(`[Seed] Synced SQLite admin credentials for: "${u}"`);
    }

    // Check products
    const checkProd = sqliteDb.prepare("SELECT count(*) as count FROM products").get();
    if (!checkProd || checkProd.count === 0) {
      const insertStmt = sqliteDb.prepare(`
        INSERT INTO products (id, name, category, shortDescription, fullDescription, price, unit, image, status, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (let i = 0; i < STARTER_PRODUCTS.length; i++) {
        const item = STARTER_PRODUCTS[i];
        const now = new Date().toISOString();
        insertStmt.run(
          String(i + 1),
          item.name,
          item.category,
          item.shortDescription,
          item.fullDescription,
          item.price,
          item.unit,
          item.image,
          item.status,
          now,
          now
        );
      }
      console.log(`[Seed] Seeded ${STARTER_PRODUCTS.length} starter products into SQLite.`);
    }
  } catch (err) {
    console.error("[Seed SQLite]", err.message);
  }
}

// -------------------------------------------------------------
// Product Repository Methods
// -------------------------------------------------------------
export async function getActiveProducts(category = null) {
  if (useMongo) {
    const filter = { status: "active" };
    if (category && category !== "All") filter.category = category;
    const list = await Product.find(filter).sort({ createdAt: -1 });
    return list.map(formatProduct);
  } else {
    let query = "SELECT * FROM products WHERE status = 'active'";
    const params = [];
    if (category && category !== "All") {
      query += " AND category = ?";
      params.push(category);
    }
    query += " ORDER BY createdAt DESC";
    const list = sqliteDb.prepare(query).all(...params);
    return list.map(formatProduct);
  }
}

export async function getProductById(id) {
  if (useMongo) {
    const p = await Product.findById(id);
    return p ? formatProduct(p) : null;
  } else {
    const p = sqliteDb.prepare("SELECT * FROM products WHERE id = ?").get(id);
    return p ? formatProduct(p) : null;
  }
}

export async function getAllProductsAdmin({ search, category, status }) {
  if (useMongo) {
    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (category && category !== "all") filter.category = category;
    if (search && search.trim()) {
      const reg = new RegExp(search.trim(), "i");
      filter.$or = [{ name: reg }, { shortDescription: reg }, { category: reg }];
    }
    const products = await Product.find(filter).sort({ createdAt: -1 });
    const total = await Product.countDocuments();
    const active = await Product.countDocuments({ status: "active" });
    const hidden = await Product.countDocuments({ status: "hidden" });
    const categories = await Product.distinct("category");

    return {
      products: products.map(formatProduct),
      stats: { total, active, hidden, categoriesCount: categories.length },
      categories,
    };
  } else {
    let query = "SELECT * FROM products WHERE 1=1";
    const params = [];

    if (status && status !== "all") {
      query += " AND status = ?";
      params.push(status);
    }

    if (category && category !== "all") {
      query += " AND category = ?";
      params.push(category);
    }

    if (search && search.trim()) {
      query += " AND (name LIKE ? OR shortDescription LIKE ? OR category LIKE ?)";
      const s = `%${search.trim()}%`;
      params.push(s, s, s);
    }

    query += " ORDER BY createdAt DESC";
    const products = sqliteDb.prepare(query).all(...params);

    const total = sqliteDb.prepare("SELECT count(*) as c FROM products").get().c;
    const active = sqliteDb.prepare("SELECT count(*) as c FROM products WHERE status = 'active'").get().c;
    const hidden = sqliteDb.prepare("SELECT count(*) as c FROM products WHERE status = 'hidden'").get().c;
    const categoriesList = sqliteDb.prepare("SELECT DISTINCT category FROM products").all();
    const categories = categoriesList.map((r) => r.category).filter(Boolean);

    return {
      products: products.map(formatProduct),
      stats: { total, active, hidden, categoriesCount: categories.length },
      categories,
    };
  }
}

export async function createProduct(data) {
  const now = new Date().toISOString();
  if (useMongo) {
    const p = new Product({ ...data });
    const saved = await p.save();
    return formatProduct(saved);
  } else {
    const id = "prod-" + Date.now() + "-" + Math.round(Math.random() * 1e4);
    sqliteDb
      .prepare(`
      INSERT INTO products (id, name, category, shortDescription, fullDescription, price, unit, image, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .run(
        id,
        data.name,
        data.category || "General",
        data.shortDescription,
        data.fullDescription || "",
        Number(data.price),
        data.unit || "Strip",
        data.image || "/uploads/9g.png",
        data.status || "active",
        now,
        now
      );
    return getProductById(id);
  }
}

export async function updateProduct(id, data) {
  const now = new Date().toISOString();
  if (useMongo) {
    const p = await Product.findById(id);
    if (!p) return null;
    if (data.name) p.name = data.name;
    if (data.category) p.category = data.category;
    if (data.shortDescription) p.shortDescription = data.shortDescription;
    if (data.fullDescription !== undefined) p.fullDescription = data.fullDescription;
    if (data.price !== undefined) p.price = Number(data.price);
    if (data.unit) p.unit = data.unit;
    if (data.status) p.status = data.status;
    if (data.image) p.image = data.image;
    const updated = await p.save();
    return formatProduct(updated);
  } else {
    const p = sqliteDb.prepare("SELECT * FROM products WHERE id = ?").get(id);
    if (!p) return null;

    const name = data.name ?? p.name;
    const category = data.category ?? p.category;
    const shortDesc = data.shortDescription ?? p.shortDescription;
    const fullDesc = data.fullDescription !== undefined ? data.fullDescription : p.fullDescription;
    const price = data.price !== undefined ? Number(data.price) : p.price;
    const unit = data.unit ?? p.unit;
    const status = data.status ?? p.status;
    const image = data.image ?? p.image;

    sqliteDb
      .prepare(`
      UPDATE products 
      SET name = ?, category = ?, shortDescription = ?, fullDescription = ?, price = ?, unit = ?, image = ?, status = ?, updatedAt = ?
      WHERE id = ?
    `)
      .run(name, category, shortDesc, fullDesc, price, unit, image, status, now, id);

    return getProductById(id);
  }
}

export async function toggleProductStatus(id) {
  if (useMongo) {
    const p = await Product.findById(id);
    if (!p) return null;
    p.status = p.status === "active" ? "hidden" : "active";
    await p.save();
    return formatProduct(p);
  } else {
    const p = sqliteDb.prepare("SELECT * FROM products WHERE id = ?").get(id);
    if (!p) return null;
    const newStatus = p.status === "active" ? "hidden" : "active";
    const now = new Date().toISOString();
    sqliteDb.prepare("UPDATE products SET status = ?, updatedAt = ? WHERE id = ?").run(newStatus, now, id);
    return getProductById(id);
  }
}

export async function deleteProduct(id) {
  if (useMongo) {
    const p = await Product.findByIdAndDelete(id);
    return p ? formatProduct(p) : null;
  } else {
    const p = sqliteDb.prepare("SELECT * FROM products WHERE id = ?").get(id);
    if (!p) return null;
    sqliteDb.prepare("DELETE FROM products WHERE id = ?").run(id);
    return formatProduct(p);
  }
}

export async function getDistinctCategories() {
  if (useMongo) {
    const cats = await Product.find({ status: "active" }).distinct("category");
    return ["All", ...cats.filter(Boolean)];
  } else {
    const list = sqliteDb.prepare("SELECT DISTINCT category FROM products WHERE status = 'active'").all();
    const cats = list.map((r) => r.category).filter(Boolean);
    return ["All", ...cats];
  }
}

// -------------------------------------------------------------
// Admin Authentication Methods
// -------------------------------------------------------------
export async function findAdminByUsername(username) {
  const clean = username.trim().toLowerCase();
  if (useMongo) {
    const a = await Admin.findOne({ username: clean });
    if (!a) return null;
    return {
      id: a._id.toString(),
      username: a.username,
      name: a.name,
      password: a.password,
      comparePassword: (candidate) => a.comparePassword(candidate),
    };
  } else {
    const a = sqliteDb.prepare("SELECT * FROM admins WHERE username = ?").get(clean);
    if (!a) return null;
    return {
      id: a.id,
      username: a.username,
      name: a.name,
      password: a.password,
      comparePassword: async (candidate) => bcrypt.compare(candidate, a.password),
    };
  }
}

// -------------------------------------------------------------
// Utility Formatter
// -------------------------------------------------------------
function formatProduct(p) {
  const id = p._id ? p._id.toString() : p.id;
  return {
    _id: id,
    id: id,
    name: p.name,
    category: p.category,
    shortDescription: p.shortDescription,
    fullDescription: p.fullDescription || "",
    price: Number(p.price),
    unit: p.unit || "Strip",
    image: p.image || "/uploads/9g.png",
    status: p.status || "active",
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}
