# Health Nutra - Fullstack Application & Admin Management System

Health Nutra is a complete nutraceutical company website featuring a public dynamic storefront, REST API, and a secure admin management portal for full product lifecycle management (add, edit, delete, show/hide).

---

## Folder Structure

```text
health-nutra/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection handler
│   ├── middleware/
│   │   ├── auth.js               # Session-based authentication middleware
│   │   ├── rateLimiter.js        # Login rate limiter (5 requests per 15 min)
│   │   └── upload.js             # Multer image upload & file validation (max 2MB, jpg/png/webp)
│   ├── models/
│   │   ├── Admin.js              # Mongoose schema for admin authentication
│   │   └── Product.js            # Mongoose schema for product inventory
│   ├── routes/
│   │   ├── adminRoutes.js        # Protected admin API routes (login, logout, CRUD, toggle)
│   │   └── publicRoutes.js       # Public storefront API routes (products, categories)
│   ├── seed/
│   │   └── seedData.js           # Database starter seeder
│   └── services/
│       └── dbService.js          # Unified database repository (SQLite + MongoDB fallback)
├── public/
│   ├── admin/
│   │   ├── admin.css             # Admin dashboard green & orange responsive stylesheet
│   │   ├── admin.html            # Admin dashboard interface with search, filters & modals
│   │   ├── admin.js              # Admin UI logic (AJAX CRUD, modals, live status toggling)
│   │   └── login.html            # Admin login screen with validation & alerts
│   ├── css/
│   │   └── style.css             # Public storefront stylesheet
│   ├── js/
│   │   └── main.js               # Public storefront vanilla JS (API fetch, category tabs, modal)
│   ├── images/                   # Static assets & brand graphics
│   └── index.html                # Public website homepage with dynamic product cards
├── uploads/                      # Static product images served at /uploads/*
│   ├── 9g.png                    # Health Nutra 9G Tablets image
│   ├── 10q.png                   # Health Nutra 10Q Syrup image
│   ├── omega3.png                # Omega-3 Softgels image
│   └── greentea.png              # Green Tea Extract image
├── src/                          # Optional React frontend application
├── .env                          # Local environment configuration (ignored by git)
├── .env.example                  # Template configuration file
├── .gitignore                    # Git ignore file (excludes .env, *.sqlite, node_modules)
├── health_nutra.sqlite           # Embedded zero-config SQLite database (auto-generated)
├── package.json                  # Dependencies and start scripts
├── README.md                     # Documentation
└── server.js                     # Express application entrypoint
```

---

## Step-by-Step Setup Instructions for VS Code

### Prerequisites
- Node.js version 18 or higher (Node 20+ or 22+ recommended; Node 24 supported).
- Visual Studio Code.

### Step 1: Open Project in VS Code
1. Launch VS Code.
2. Select **File** > **Open Folder...** (or press `Ctrl+K Ctrl+O`).
3. Browse to and select the `health-nutra` folder.
4. Open the integrated terminal by pressing `Ctrl+\`` (or **Terminal** > **New Terminal**).

### Step 2: Install Dependencies
Run the following command in the terminal to install all required packages:
```bash
npm install
```

This installs:
- `express`: Web server framework
- `express-session`: Server-side session management
- `bcryptjs`: Password hashing
- `multer`: File upload handling
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variable loader
- `express-rate-limit`: Brute-force protection
- `mongoose`: MongoDB ODM

### Step 3: Create the .env File
Copy `.env.example` to create `.env`:
```bash
cp .env.example .env
```
*(On Windows PowerShell, you can also use `copy .env.example .env`)*

Open `.env` in VS Code and verify the settings:
```env
# Server Configuration
PORT=5000
SESSION_SECRET=health-nutra-secure-production-secret-key-2026

# Database
# Default uses built-in SQLite (no setup required).
# To use MongoDB, start mongod or paste a MongoDB Atlas connection string:
MONGODB_URI=mongodb://127.0.0.1:27017/health_nutra

# Default Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### Step 4: Run the Server
Start the application:
```bash
npm start
```
or:
```bash
node server.js
```

Upon launch, the server automatically:
1. Connects to MongoDB if running, or falls back to the zero-config embedded SQLite database (`health_nutra.sqlite`).
2. Creates the necessary tables and schema.
3. Automatically seeds the default admin account (`admin` / `admin123`).
4. Automatically seeds the 4 starter products.
5. Listens on `http://localhost:5000`.

### Step 5: Access the Admin Panel
1. Open your browser and navigate to:
   ```text
   http://localhost:5000/admin
   ```
2. You will be redirected to the secure login page (`/admin/login`).
3. Enter the default credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
4. You will arrive at the Admin Dashboard where you can manage products, view inventory stats, toggle product visibility, and upload images.

### Step 6: View the Public Website
Open your browser and navigate to:
```text
http://localhost:5000/
```
The public product catalog dynamically loads active products from the database via `GET /api/products`. Toggling a product to hidden in the admin panel immediately updates the public storefront on refresh.

---

## Seeded Starter Products

The database automatically seeds with the following 4 products:

| Product Name | Category | Price | Unit | Status | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Health Nutra 9G | Multivitamin | ₹235 | Strip | active | Complete daily nutrition with vitamins & minerals. |
| Health Nutra 10Q Syrup | Syrup | ₹210 | 200ml | active | Energy booster syrup with CoQ10 & antioxidants for daily vitality. |
| Omega-3 Capsules | Omega-3 | ₹499 | Strip | active | Supports heart, brain, joint, and cardiovascular wellness. |
| Green Tea Extract | Green Tea | ₹299 | Box | active | Standardised 50% EGCG capsules for metabolism & antioxidant support. |

---

## Admin Panel Features

1. **Authentication & Session Security**:
   - Protected routes using `express-session` with secure HTTP-only cookies.
   - Login rate-limiting allowing a maximum of 5 attempts per 15 minutes to prevent brute-force attacks.
   - Passwords stored as salted bcrypt hashes.

2. **Dashboard & Inventory Metrics**:
   - Real-time stat counters: Total Products, Active Products, Hidden Products, and Categories.
   - Live search by product name, description, or category.
   - Category filtering (All, Multivitamin, Syrup, Omega-3, Green Tea).
   - Status filtering (All, Active, Hidden).

3. **Add Product**:
   - Form validation: Name and Price are mandatory; Price must be a positive number greater than 0.
   - File upload supporting `.jpg`, `.jpeg`, `.png`, and `.webp` with a 2MB maximum file size limit.
   - Live image preview before submitting.

4. **Edit Product**:
   - Modal pre-populated with existing product information.
   - Option to keep the current image or replace it with a new upload.

5. **Toggle Product Visibility**:
   - One-click status switch between Active and Hidden without deleting the record.
   - Hidden products are automatically excluded from the public website and public API.

6. **Delete Product**:
   - Confirmation dialog before deletion to prevent accidental data loss.
   - Associated custom upload image is safely cleaned up from disk.

7. **Logout**:
   - Destroys the server session and clears authentication cookies.

---

## Public REST API Endpoints

### 1. Get Active Products
- **Endpoint**: `GET /api/products`
- **Query Parameters**: `?category=Multivitamin` (optional)
- **Description**: Returns JSON array of all products with `status = 'active'`. Hidden products are never returned.
- **Example Response**:
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "id": "1",
      "name": "Health Nutra 9G",
      "category": "Multivitamin",
      "shortDescription": "Complete daily nutrition with vitamins & minerals.",
      "fullDescription": "Multivitamin, multimineral & antioxidant tablets...",
      "price": 235,
      "unit": "Strip",
      "image": "/uploads/9g.png",
      "status": "active"
    }
  ]
}
```

### 2. Get Single Product
- **Endpoint**: `GET /api/products/:id`
- **Description**: Returns detail data for an active product. Returns 404 if hidden or not found.

### 3. Get Active Categories
- **Endpoint**: `GET /api/categories`
- **Description**: Returns list of all distinct categories currently present among active products.

---

## Security Architecture

- **Input Sanitization**: All string fields are trimmed and sanitized server-side.
- **Authentication Guard**: Unauthenticated requests to `/admin` redirect to `/admin/login`. Unauthenticated API requests receive HTTP 401 Unauthorized.
- **Brute Force Protection**: IP-based rate limiter restricts consecutive failed login attempts.
- **File Validation**: Multer checks both MIME type and file extension, rejecting files larger than 2MB.
- **Data Protection**: SQLite database files (`*.sqlite`) and `.env` are listed in `.gitignore` and are not exposed statically.

---

## Database Flexibility

The backend service layer (`backend/services/dbService.js`) provides dual database engine compatibility:
1. **Embedded SQLite (Default)**: Uses Node.js's built-in `node:sqlite` engine. Requires zero installation, zero external daemons, and works out-of-the-box.
2. **MongoDB / MongoDB Atlas**: If a local `mongod` service is running or a cloud MongoDB Atlas URI is set in `MONGODB_URI`, the application automatically connects to MongoDB. If MongoDB is unavailable, it gracefully falls back to SQLite with full feature parity.

---

## License
Proprietary and confidential. (c) Health Nutra. All rights reserved.
