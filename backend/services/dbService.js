import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dns from "dns";
import { Product } from "../models/Product.js";
import { Admin } from "../models/Admin.js";
import { Order } from "../models/Order.js";
import { Enquiry } from "../models/Enquiry.js";

// Ensure DNS SRV records resolve reliably for MongoDB Atlas on all environments (e.g. Windows ISP routers)
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {}

const STARTER_ORDERS = [
  {
    orderId: "HN-ORD-1001",
    customerName: "Rahul Sharma",
    customerPhone: "+91 98765 43210",
    customerEmail: "rahul.sharma@example.com",
    shippingAddress: "Flat 402, Green Valley Apartments, Sector 14",
    city: "Gurugram",
    pincode: "122001",
    items: [
      { productId: "1", name: "Health Nutra 9G", price: 235, quantity: 2, unit: "Strip", image: "/uploads/9g.png" },
      { productId: "3", name: "Omega-3 Capsules", price: 499, quantity: 1, unit: "Strip", image: "/uploads/omega3.png" },
    ],
    totalAmount: 969,
    paymentMethod: "Cash on Delivery (COD)",
    paymentStatus: "paid",
    orderStatus: "delivered",
    notes: "Customer requested evening delivery",
  },
  {
    orderId: "HN-ORD-1002",
    customerName: "Priya Patel",
    customerPhone: "+91 98111 22334",
    customerEmail: "priya.patel@example.com",
    shippingAddress: "12, Shanti Niketan Society, Navrangpura",
    city: "Ahmedabad",
    pincode: "380009",
    items: [
      { productId: "2", name: "Health Nutra Q10+ Syrup", price: 210, quantity: 2, unit: "200ml", image: "/uploads/10q.png" },
    ],
    totalAmount: 420,
    paymentMethod: "UPI / Online",
    paymentStatus: "paid",
    orderStatus: "shipped",
    notes: "Dispatched via Express Courier",
  },
  {
    orderId: "HN-ORD-1003",
    customerName: "Amit Verma",
    customerPhone: "+91 99887 76655",
    customerEmail: "amit.verma@example.com",
    shippingAddress: "House No. 84, Gomti Nagar",
    city: "Lucknow",
    pincode: "226010",
    items: [
      { productId: "4", name: "Green Tea Extract", price: 299, quantity: 1, unit: "Box", image: "/uploads/greentea.png" },
      { productId: "1", name: "Health Nutra 9G", price: 235, quantity: 1, unit: "Strip", image: "/uploads/9g.png" },
    ],
    totalAmount: 534,
    paymentMethod: "Cash on Delivery (COD)",
    paymentStatus: "cod",
    orderStatus: "pending",
    notes: "New customer order - verification pending",
  },
];

const STARTER_PRODUCTS = [
  {
    name: "Health Nutra 9G",
    category: "Multivitamin",
    shortDescription: "Multivitamin and multimineral tablets with omega-3 from flaxseed oil, lycopene, botanical extracts, amino acids, vitamins, minerals and trace elements.",
    fullDescription:
      "Health Nutra 9G is a multivitamin, multimineral and antioxidant tablet formulation. The package lists omega-3 fatty acids from flaxseed oil, lycopene, L-carnitine L-tartrate, green tea and grape seed extracts, ginkgo biloba, ginseng, garlic and ginger extracts, green coffee bean, glycyrrhiza glabra, guggul, essential amino acids, cyanocobalamin, vitamins, minerals and trace elements. The packaging presents it for energy and stamina, immunity, brain and heart health, antioxidant support and overall wellness. Follow the directions on the pack.",
    price: 235,
    mrp: 235,
    unit: "Strip",
    image: "/uploads/9g.png",
    status: "active",
  },
  {
    name: "Health Nutra Q10+ Syrup",
    category: "Syrup",
    shortDescription: "200 ml sugar-free mango-flavoured multivitamin and multimineral syrup with lycopene and amino acids.",
    fullDescription:
      "Health Nutra Q10+ is a 200 ml sugar-free mango-flavoured multivitamin and multimineral syrup. The package lists Coenzyme Q10, L-lysine and cyanocobalamin with lycopene and amino acids. The packaging presents it for energy, growth, immunity, brain function and overall wellness. Shake well and follow the directions on the pack.",
    price: 210,
    mrp: 210,
    unit: "200ml",
    image: "/uploads/10q.png",
    status: "active",
  },
  {
    name: "Health Nutra Liv+ Syrup",
    category: "Liver Care",
    shortDescription: "200 ml sugar-free mixed-fruit liver, enzyme and appetizer syrup with natural herbs.",
    fullDescription:
      "Health Nutra Liv+ is a 200 ml sugar-free, mixed-fruit liver, enzyme and appetizer syrup. The packaging describes it as an advanced liver-care formula and presents it for supporting healthy liver function, appetite and digestion, enzyme activity, and general wellness. Enriched with natural herbs. Follow the directions on the pack.",
    price: 1,
    mrp: 1,
    unit: "200ml",
    image: "/images/livplus.jpeg",
    status: "hidden",
    pricePending: true,
  },
  {
    name: "Health Nutra NariA+ Syrup",
    category: "Women's Wellness",
    shortDescription: "200 ml sugar-free Ayurvedic women's wellness syrup with 1800 mg Ashoka root extract.",
    fullDescription:
      "Health Nutra NariA+ is a 200 ml sugar-free, mixed-fruit Ayurvedic wellness syrup featuring 1800 mg Ashoka root extract. The packaging presents it for women's wellness, hormonal balance, strength and energy, healthy menstruation, and overall wellbeing. Follow the directions on the pack.",
    price: 1,
    mrp: 1,
    unit: "200ml",
    image: "/images/naria-plus.jpeg",
    status: "hidden",
    pricePending: true,
  },
  {
    name: "Health Nutra Lipron+ Syrup",
    category: "Iron Supplement",
    shortDescription: "200 ml sugar-free mixed-fruit syrup with liposomal ferric pyrophosphate, folic acid, cyanocobalamin and L-lysine.",
    fullDescription:
      "Health Nutra Lipron+ is a 200 ml sugar-free, mixed-fruit syrup containing liposomal ferric pyrophosphate, folic acid, cyanocobalamin and L-lysine. The packaging highlights iron absorption using liposomal technology, red blood cell formation, fatigue and weakness, and overall wellbeing. Follow the directions on the pack.",
    price: 1,
    mrp: 1,
    unit: "200ml",
    image: "/images/lipron-plus.jpeg",
    status: "hidden",
    pricePending: true,
  },
];

const STARTER_ENQUIRIES = [
  {
    name: "Dr. Sunita Rao",
    email: "sunita.rao@example.com",
    phone: "+91 98450 12345",
    subject: "Bulk Order & Dealership",
    message: "We run a multi-specialty wellness clinic in Bengaluru and would like to stock Health Nutra 9G and Omega-3 capsules in bulk. Please share trade pricing and distributor terms.",
    status: "new",
  },
  {
    name: "Vikram Malhotra",
    email: "vikram.m@example.com",
    phone: "+91 98200 55443",
    subject: "Dosage & Formulation Query",
    message: "Is Health Nutra 10Q Syrup suitable for diabetic patients? Please clarify the sweetener base used in the formulation.",
    status: "contacted",
  },
  {
    name: "Ananya Deshmukh",
    email: "ananya.d@example.com",
    phone: "+91 97660 88990",
    subject: "Product Delivery Time",
    message: "Thank you for the prompt dispatch of order HN-ORD-1002. Product quality is excellent.",
    status: "resolved",
  },
];

const STARTER_NAMES = ["Health Nutra 9G", "Health Nutra Q10+ Syrup", "Health Nutra Liv+ Syrup", "Health Nutra NariA+ Syrup", "Health Nutra Lipron+ Syrup"];

/**
 * Pure MongoDB Initialization
 */
export async function initDatabase() {
  const mongoUri =
    process.env.MONGODB_URI ||
    "mongodb+srv://healthnutra16_db_user:xBLTmExrXqSejMKj@healthnutra.i5aemfd.mongodb.net/health_nutra?retryWrites=true&w=majority";

  mongoose.set("bufferCommands", false);

  if (mongoose.connection.readyState === 1) {
    return "MONGODB";
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 1,
    });
    console.log(`[Database] Connected to MongoDB Atlas at: ${mongoose.connection.host}`);
    await seedMongo();
    return "MONGODB";
  } catch (err) {
    console.error(`[Database] FATAL: Failed to connect to MongoDB Atlas: ${err.message}`);
    throw err;
  }
}

/**
 * Idempotent MongoDB Seeder
 */
async function seedMongo() {
  try {
    // 1. Seed or sync primary admin
    const u = (process.env.ADMIN_USERNAME || "healthnutra16@gmail.com").trim().toLowerCase();
    const p = process.env.ADMIN_PASSWORD || "2000@HNutra";

    let existingAdmin = await Admin.findOne({ username: u }).select("+password");
    if (!existingAdmin) {
      const hashed = await bcrypt.hash(p, 10);
      await Admin.create({ username: u, password: hashed, name: "Health Nutra Administrator" });
      console.log(`[Seed] Created primary MongoDB admin: "${u}"`);
    } else {
      const match = await existingAdmin.comparePassword(p);
      if (!match) {
        const hashed = await bcrypt.hash(p, 10);
        await Admin.updateOne({ _id: existingAdmin._id }, { $set: { password: hashed } });
        console.log(`[Seed] Synchronized primary admin password for: "${u}"`);
      }
    }

    // Also ensure fallback admin account exists for tests
    let testAdmin = await Admin.findOne({ username: "admin" }).select("+password");
    if (!testAdmin) {
      const hashed = await bcrypt.hash("admin123", 10);
      await Admin.create({ username: "admin", password: hashed, name: "Health Nutra Administrator" });
    } else {
      const match = await testAdmin.comparePassword("admin123");
      if (!match) {
        const hashed = await bcrypt.hash("admin123", 10);
        await Admin.updateOne({ _id: testAdmin._id }, { $set: { password: hashed } });
      }
    }

    // 2. Seed starter products if catalog is empty
    const prodCount = await Product.countDocuments();
    if (prodCount === 0) {
      await Product.insertMany(STARTER_PRODUCTS);
      console.log(`[Seed] Seeded ${STARTER_PRODUCTS.length} starter products into MongoDB.`);
    }

    // 3. Seed starter orders in development / test if empty
    if (process.env.NODE_ENV !== "production") {
      const orderCount = await Order.countDocuments();
      if (orderCount === 0) {
        await Order.insertMany(STARTER_ORDERS);
        console.log(`[Seed] Seeded ${STARTER_ORDERS.length} starter orders into MongoDB (Dev mode).`);
      }

      // 4. Seed starter enquiries if empty
      const enquiryCount = await Enquiry.countDocuments();
      if (enquiryCount === 0) {
        await Enquiry.insertMany(STARTER_ENQUIRIES);
        console.log(`[Seed] Seeded ${STARTER_ENQUIRIES.length} sample enquiries into MongoDB.`);
      }
    }
  } catch (err) {
    console.error("[Seed Mongo Notice]", err.message);
  }
}

// -------------------------------------------------------------
// Formatters
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
    mrp: Number(p.mrp ?? p.price),
    unit: p.unit || "Strip",
    image: p.image || "/uploads/9g.png",
    images: Array.isArray(p.images) ? p.images.filter(Boolean).slice(0, 5) : [],
    status: p.status || "active",
    pricePending: Boolean(p.pricePending),
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

function formatOrder(o) {
  const id = o._id ? o._id.toString() : o.id;
  return {
    _id: id,
    id: id,
    orderId: o.orderId,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    customerEmail: o.customerEmail || "",
    shippingAddress: o.shippingAddress,
    city: o.city || "",
    pincode: o.pincode || "",
    items: o.items || [],
    totalAmount: Number(o.totalAmount),
    paymentMethod: o.paymentMethod || "Cash on Delivery (COD)",
    paymentStatus: o.paymentStatus || "pending",
    orderStatus: o.orderStatus || o.status || "pending",
    notes: o.notes || "",
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

function formatEnquiry(e) {
  const id = e._id ? e._id.toString() : e.id;
  return {
    _id: id,
    id: id,
    name: e.name,
    email: e.email,
    phone: e.phone || "",
    subject: e.subject || "General",
    message: e.message,
    status: e.status || "new",
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  };
}

// -------------------------------------------------------------
// Product Repository Methods
// -------------------------------------------------------------
export async function getActiveProducts(category = null) {
  const filter = { $or: [{ status: "active" }, { pricePending: true }] };
  if (category && category !== "All") {
    filter.category = category;
  }
  let products = await Product.find(filter).sort({ createdAt: -1 });

  // Self-healing fallback if database has zero active products
  if (products.length === 0 && (!category || category === "All")) {
    try {
      await Product.insertMany(STARTER_PRODUCTS);
      products = await Product.find({ $or: [{ status: "active" }, { pricePending: true }] });
    } catch (e) {
      console.warn("[Database] Product self-heal notice:", e.message);
    }
  }

  return products.map((product) => {
    const formatted = formatProduct(product);
    if (formatted.pricePending) {
      formatted.price = null;
      formatted.mrp = null;
    }
    return formatted;
  });
}

export async function getProductById(id) {
  if (!id) return null;
  let p = null;
  const isHex24 = typeof id === "string" && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id);
  if (isHex24 && mongoose.Types.ObjectId.isValid(id)) {
    p = await Product.findById(id).catch(() => null);
  }
  if (!p) {
    // Support matching by numeric starter ID ("1", "2", "3", "4") or custom id
    const num = parseInt(id, 10);
    if (!isNaN(num) && num >= 1 && num <= STARTER_NAMES.length) {
      p = await Product.findOne({ name: STARTER_NAMES[num - 1] }).catch(() => null);
    }
    if (!p && !isNaN(num) && num > 0) {
      const all = await Product.find({ status: "active" }).sort({ createdAt: 1 });
      if (all[num - 1]) p = all[num - 1];
    }
    if (!p) {
      p = await Product.findOne({ name: id }).catch(() => null);
    }
  }
  return p ? formatProduct(p) : null;
}

export async function getAllProductsAdmin({ search, category, status, page, limit } = {}) {
  const pageNum = page ? Math.max(1, parseInt(page, 10)) : 1;
  const limitNum = limit ? Math.min(100, Math.max(1, parseInt(limit, 10))) : 50;
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (status && status !== "all") filter.status = status;
  if (category && category !== "all") filter.category = category;
  if (search && search.trim()) {
    const reg = new RegExp(search.trim(), "i");
    filter.$or = [{ name: reg }, { shortDescription: reg }, { category: reg }];
  }

  const [products, filteredTotal, total, active, hidden, categories] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Product.countDocuments(filter),
    Product.countDocuments(),
    Product.countDocuments({ status: "active" }),
    Product.countDocuments({ status: "hidden" }),
    Product.distinct("category"),
  ]);

  return {
    products: products.map(formatProduct),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: filteredTotal,
      totalPages: Math.ceil(filteredTotal / limitNum) || 1,
    },
    stats: { total, active, hidden, categoriesCount: categories.length },
    categories,
  };
}

export async function createProduct(data) {
  const p = new Product({ ...data });
  const saved = await p.save();
  return formatProduct(saved);
}

export async function updateProduct(id, data) {
  let p = null;
  const isHex24 = typeof id === "string" && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id);
  if (isHex24 && mongoose.Types.ObjectId.isValid(id)) {
    p = await Product.findByIdAndUpdate(id, data, { returnDocument: "after" });
  } else {
    p = await Product.findOneAndUpdate({ name: id }, data, { returnDocument: "after" });
  }
  return p ? formatProduct(p) : null;
}

export async function toggleProductStatus(id) {
  const current = await getProductById(id);
  if (!current) return null;
  const newStatus = current.status === "active" ? "hidden" : "active";
  return updateProduct(current.id, { status: newStatus });
}

export async function deleteProduct(id) {
  let p = null;
  const isHex24 = typeof id === "string" && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id);
  if (isHex24 && mongoose.Types.ObjectId.isValid(id)) {
    p = await Product.findByIdAndDelete(id);
  } else {
    p = await Product.findOneAndDelete({ name: id });
  }
  return p ? formatProduct(p) : null;
}

export async function getDistinctCategories() {
  const cats = await Product.distinct("category", {
    $or: [{ status: "active" }, { pricePending: true }],
  });
  return ["All", ...cats.filter(Boolean)];
}

// -------------------------------------------------------------
// Admin Authentication Methods
// -------------------------------------------------------------
export async function findAdminByUsername(username) {
  const clean = username.trim().toLowerCase();
  const a = await Admin.findOne({ username: clean }).select("+password");
  if (!a) return null;
  return {
    id: a._id.toString(),
    username: a.username,
    name: a.name,
    comparePassword: (candidate) => a.comparePassword(candidate),
  };
}

export async function syncAdminPassword(username, newPassword) {
  const u = username.trim().toLowerCase();
  const hashed = await bcrypt.hash(newPassword, 10);
  await Admin.findOneAndUpdate(
    { username: u },
    { username: u, password: hashed, name: "Health Nutra Administrator" },
    { upsert: true, returnDocument: "after" }
  );
}

// -------------------------------------------------------------
// Order Repository Methods
// -------------------------------------------------------------
export async function createOrder(data) {
  const randNum = Math.floor(100000 + Math.random() * 900000);
  const orderId = data.orderId || `HN-ORD-${randNum}`;
  const totalAmount = Number(data.totalAmount) || 0;
  const items = Array.isArray(data.items) ? data.items : [];

  const newOrder = new Order({
    orderId,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    customerEmail: data.customerEmail || "",
    shippingAddress: data.shippingAddress,
    city: data.city || "",
    pincode: data.pincode || "",
    items,
    totalAmount,
    paymentMethod: data.paymentMethod || "Cash on Delivery (COD)",
    paymentStatus: data.paymentStatus || "pending",
    orderStatus: data.orderStatus || "pending",
    notes: data.notes || "",
  });
  const saved = await newOrder.save();
  return formatOrder(saved);
}

export async function getOrderById(idOrOrderId) {
  if (!idOrOrderId) return null;
  let order = await Order.findOne({ orderId: idOrOrderId }).catch(() => null);
  const isHex24 = typeof idOrOrderId === "string" && idOrOrderId.length === 24 && /^[0-9a-fA-F]{24}$/.test(idOrOrderId);
  if (!order && isHex24 && mongoose.Types.ObjectId.isValid(idOrOrderId)) {
    order = await Order.findById(idOrOrderId).catch(() => null);
  }
  return order ? formatOrder(order) : null;
}

export async function getAllOrdersAdmin({ search = "", status = "", page, limit } = {}) {
  const pageNum = page ? Math.max(1, parseInt(page, 10)) : 1;
  const limitNum = limit ? Math.min(100, Math.max(1, parseInt(limit, 10))) : 50;
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (status && status !== "all") {
    filter.orderStatus = status;
  }
  if (search && search.trim()) {
    const term = new RegExp(search.trim(), "i");
    filter.$or = [{ orderId: term }, { customerName: term }, { customerPhone: term }, { city: term }];
  }

  const [orders, filteredTotal, total, pending, processing, shipped, delivered, cancelled, revAgg] =
    await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Order.countDocuments(filter),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: "pending" }),
      Order.countDocuments({ orderStatus: "processing" }),
      Order.countDocuments({ orderStatus: "shipped" }),
      Order.countDocuments({ orderStatus: "delivered" }),
      Order.countDocuments({ orderStatus: "cancelled" }),
      Order.aggregate([
        { $match: { orderStatus: { $ne: "cancelled" } } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
      ]),
    ]);

  const revenue = revAgg[0] ? revAgg[0].totalRevenue : 0;
  const stats = { total, pending, processing, shipped, delivered, cancelled, revenue };

  return {
    orders: orders.map(formatOrder),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: filteredTotal,
      totalPages: Math.ceil(filteredTotal / limitNum) || 1,
    },
    stats,
  };
}

export async function updateOrderStatus(idOrOrderId, updates = {}) {
  let order = await Order.findOne({ orderId: idOrOrderId }).catch(() => null);
  const isHex24 = typeof idOrOrderId === "string" && idOrOrderId.length === 24 && /^[0-9a-fA-F]{24}$/.test(idOrOrderId);
  if (!order && isHex24 && mongoose.Types.ObjectId.isValid(idOrOrderId)) {
    order = await Order.findById(idOrOrderId).catch(() => null);
  }
  if (!order) return null;

  if (updates.orderStatus) order.orderStatus = updates.orderStatus;
  if (updates.paymentStatus) order.paymentStatus = updates.paymentStatus;
  if (updates.notes !== undefined) order.notes = updates.notes;
  await order.save();
  return formatOrder(order);
}

export async function deleteOrder(idOrOrderId) {
  let order = await Order.findOneAndDelete({ orderId: idOrOrderId }).catch(() => null);
  const isHex24 = typeof idOrOrderId === "string" && idOrOrderId.length === 24 && /^[0-9a-fA-F]{24}$/.test(idOrOrderId);
  if (!order && isHex24 && mongoose.Types.ObjectId.isValid(idOrOrderId)) {
    order = await Order.findByIdAndDelete(idOrOrderId).catch(() => null);
  }
  return order ? formatOrder(order) : null;
}

// -------------------------------------------------------------
// Customer Enquiry Repository Methods
// -------------------------------------------------------------
export async function createEnquiry(data) {
  const enquiry = new Enquiry({
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: (data.phone || "").trim(),
    subject: (data.subject || "General").trim(),
    message: data.message.trim(),
    status: data.status || "new",
  });
  const saved = await enquiry.save();
  return formatEnquiry(saved);
}

export async function getEnquiryById(id) {
  if (!id) return null;
  const isHex24 = typeof id === "string" && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id);
  if (!isHex24 || !mongoose.Types.ObjectId.isValid(id)) return null;
  const e = await Enquiry.findById(id).catch(() => null);
  return e ? formatEnquiry(e) : null;
}

export async function getAllEnquiriesAdmin({ search = "", status = "", page, limit } = {}) {
  const pageNum = page ? Math.max(1, parseInt(page, 10)) : 1;
  const limitNum = limit ? Math.min(100, Math.max(1, parseInt(limit, 10))) : 50;
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (status && status !== "all") {
    filter.status = status;
  }
  if (search && search.trim()) {
    const term = new RegExp(search.trim(), "i");
    filter.$or = [{ name: term }, { email: term }, { phone: term }, { subject: term }, { message: term }];
  }

  const [enquiries, filteredTotal, total, newCount, contactedCount, resolvedCount] = await Promise.all([
    Enquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Enquiry.countDocuments(filter),
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ status: "new" }),
    Enquiry.countDocuments({ status: "contacted" }),
    Enquiry.countDocuments({ status: "resolved" }),
  ]);

  return {
    enquiries: enquiries.map(formatEnquiry),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: filteredTotal,
      totalPages: Math.ceil(filteredTotal / limitNum) || 1,
    },
    stats: {
      total,
      new: newCount,
      contacted: contactedCount,
      resolved: resolvedCount,
    },
  };
}

export async function updateEnquiryStatus(id, newStatus) {
  const allowed = ["new", "contacted", "resolved"];
  if (!allowed.includes(newStatus)) {
    throw new Error(`Invalid enquiry status: "${newStatus}". Must be one of: ${allowed.join(", ")}`);
  }
  const isHex24 = typeof id === "string" && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id);
  if (!isHex24 || !mongoose.Types.ObjectId.isValid(id)) return null;

  const updated = await Enquiry.findByIdAndUpdate(id, { status: newStatus }, { returnDocument: "after" });
  return updated ? formatEnquiry(updated) : null;
}

export async function deleteEnquiry(id) {
  const isHex24 = typeof id === "string" && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id);
  if (!isHex24 || !mongoose.Types.ObjectId.isValid(id)) return null;
  const deleted = await Enquiry.findByIdAndDelete(id);
  return deleted ? formatEnquiry(deleted) : null;
}

export async function getAllEnquiriesForExport() {
  const list = await Enquiry.find({}).sort({ createdAt: -1 }).limit(10000);
  return list.map(formatEnquiry);
}

export default {
  initDatabase,
  getActiveProducts,
  getProductById,
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  toggleProductStatus,
  deleteProduct,
  getDistinctCategories,
  findAdminByUsername,
  syncAdminPassword,
  createOrder,
  getOrderById,
  getAllOrdersAdmin,
  updateOrderStatus,
  deleteOrder,
  createEnquiry,
  getEnquiryById,
  getAllEnquiriesAdmin,
  updateEnquiryStatus,
  deleteEnquiry,
  getAllEnquiriesForExport,
};
