# Health Nutra - Fullstack Application & Admin Management System

Health Nutra is a nutraceutical company web platform featuring a dynamic storefront, centralized frontend store, REST API, a 5-minute keep-alive cron job, and a secure admin management portal for complete product inventory control (add, edit, delete, show/hide).

---

## Folder Structure

```text
health-nutra/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection handler
│   ├── google-apps-script/
│   │   └── Code.gs               # Optional Google Sheets sync script
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
│       ├── cronService.js        # Automated 5-minute keep-alive cron job
│       └── dbService.js          # Unified repository (SQLite + MongoDB fallback & admin sync)
├── frontend/                     # All frontend code, store, and UI assets
│   ├── admin/
│   │   ├── admin.html            # Tailwind CSS admin portal interface
│   │   ├── admin.js              # Admin AJAX logic with Lucide icons
│   │   └── login.html            # Tailwind CSS admin authentication screen
│   ├── images/                   # Static branding & logo assets
│   ├── api.json                  # Centralized API endpoint routing & icon configuration
│   ├── index.html                # Tailwind CSS public storefront
│   ├── main.js                   # Storefront UI bindings and modal rendering
│   ├── navigation.js             # Dynamic navigation, responsive drawer & scrollspy
│   └── store.js                  # Centralized reactive frontend store (products & categories)
├── uploads/                      # Static product images served at /uploads/*
│   ├── 9g.png                    # Health Nutra 9G Tablets
│   ├── 10q.png                   # Health Nutra 10Q Syrup
│   ├── omega3.png                # Omega-3 Softgels
│   └── greentea.png              # Green Tea Extract
├── .env                          # Local environment configuration (ignored by git)
├── .env.example                  # Template configuration file with APP_URL and API_URL
├── .gitignore                    # Excludes .env, *.sqlite, node_modules
├── health_nutra.sqlite           # Embedded zero-config SQLite database (auto-generated)
├── package.json                  # Clean dependencies and scripts (Express, SQLite, Cron)
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
3. Select the `health-nutra` folder.
4. Open the integrated terminal (`Ctrl+\`` or **Terminal** > **New Terminal**).

### Step 2: Install Dependencies
Run the following command:
```bash
npm install
```

Installed packages:
- `express`: Web server framework
- `express-session`: Session management
- `bcryptjs`: Password hashing
- `multer`: File upload handling
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment configuration
- `express-rate-limit`: Brute-force protection
- `node-cron`: Scheduled keep-alive ping tasks
- `mongoose`: MongoDB ODM

### Step 3: Create the .env File
Copy `.env.example` to create `.env`:
```bash
cp .env.example .env
```
*(On Windows PowerShell: `copy .env.example .env`)*

Open `.env` and verify the settings:
```env
# Server Configuration
PORT=5000
HOST=0.0.0.0
SESSION_SECRET=health-nutra-secure-production-secret-key-2026

# Database
# Default uses built-in SQLite (zero external setup).
# To use MongoDB, start mongod or paste a MongoDB Atlas connection string:
MONGODB_URI=mongodb://127.0.0.1:27017/health_nutra

# Default Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Keep-Alive Cron Configuration
PING_INTERVAL_MINUTES=5
# Set APP_URL to your live deployed domain (e.g. https://health-nutra.onrender.com)
APP_URL=http://localhost:5000
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

Upon launch:
1. Connects to MongoDB if available, or automatically uses the zero-config embedded SQLite database (`health_nutra.sqlite`).
2. Syncs and updates the admin account with the credentials configured in `.env`.
3. Seeds starter products if the inventory is empty.
4. Starts the 5-minute keep-alive cron job to keep free-tier deployments awake.
5. Listens on `http://localhost:5000`.

### Step 5: Access the Admin Panel
1. Open your browser and navigate to:
   ```text
   http://localhost:5000/admin
   ```
2. Enter the default credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
3. The Admin Dashboard allows managing inventory, toggling visibility, uploading product images, and viewing live stats.

### Step 6: View the Public Website
Open:
```text
http://localhost:5000/
```
The storefront dynamically loads active formulations from the reactive frontend store and API.

---

## Frontend Architecture

### 1. Central API Configuration (`frontend/api.json`)
Defines all endpoints, route contracts, keep-alive interval, category icon mappings, and brand palettes. Both the storefront and admin components read from this JSON specification.

### 2. Reactive Store (`frontend/store.js`)
Centralized state management providing:
- Asynchronous fetching of products and categories.
- Instant search filtering across product titles, descriptions, and active categories.
- Modal state management for full clinical descriptions.
- Reactive pub/sub pattern that updates the DOM and re-initializes vector icons automatically.

### 3. Dynamic Navigation (`frontend/navigation.js`)
- Renders responsive desktop navigation with Lucide vector icons.
- Provides a mobile drawer menu with hamburger toggle animations.
- Scrollspy listener that highlights the active section as the user scrolls.
- Live admin session check that displays an active session pill when staff are logged in.

### 4. Modern Tailwind CSS & Lucide Vector Icons
- All frontend pages utilize Tailwind CSS utility classes instead of plain CSS.
- Hardcoded broken images are replaced with scalable Lucide vector icons (`pill`, `droplet`, `heart-pulse`, `leaf`, `shield-check`, `flask-conical`, `sparkles`).
- Product cards include SVG/Lucide fallback placeholders if an image is ever missing.

---

## 5-Minute Keep-Alive Cron Service

Free-tier hosting providers (such as Render, Railway, Glitch) automatically put backend containers to sleep after 15 minutes of inactivity, causing 30-50 second cold-start delays.

The backend includes a scheduled worker (`backend/services/cronService.js`) using `node-cron`:
- Runs every 5 minutes (`*/5 * * * *`).
- Sends a `GET` request to `/api/products` or `/health`.
- Automatically targets `process.env.APP_URL` or `process.env.RENDER_EXTERNAL_URL` in production, and `http://localhost:5000` in development.
- Logs heartbeat timestamps to verify container responsiveness.

---

---

## Step-by-Step Render Deployment Guide (Backend & Frontend)

Health Nutra is engineered as a unified, production-ready fullstack application: the Express backend serves the high-performance Tailwind CSS storefront (`frontend/`), the administrative dashboard (`frontend/admin/`), uploads, REST APIs, and a 5-minute keepalive cron job from a single Render Web Service.

This provides:
- **Zero CORS Issues**: Storefront and backend share the identical origin.
- **Reliable Admin Authentication**: Cookies are never blocked by modern browser third-party cookie restrictions.
- **24/7 Keep-Alive**: The built-in 5-minute cron ping prevents Render Free Tier spun-down / cold starts.
- **Cost Effective**: Runs completely within Render's free tier (1 service = 750 free hours/month).

### Method 1: Deploy via Render Dashboard (Recommended)

1. **Log in to Render**: Visit [dashboard.render.com](https://dashboard.render.com/) and click **New +** > **Web Service**.
2. **Connect GitHub**: Select your GitHub repository: `https://github.com/sandeepmehta-s/Health-Nutra`.
3. **Configure the Service**:
   - **Name**: `health-nutra` (or your preferred name)
   - **Region**: Closest to your users (e.g., Singapore, Frankfurt, Oregon, Ohio)
   - **Branch**: `main`
   - **Root Directory**: `backend` *(Essential: tells Render to build inside the backend folder)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. **Expand "Advanced" Settings**:
   - **Health Check Path**: `/health` *(Render pings this to confirm successful deployment before routing traffic)*
   - **Auto-Deploy**: `Yes` *(Automatically rebuilds and deploys when you push to GitHub)*
5. **Add Environment Variables**:
   Click **Add Environment Variable** and enter:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_VERSION` | `22.14.0` | Uses Node.js 22 LTS with native SQLite support |
   | `NODE_ENV` | `production` | Enables production optimizations |
   | `HOST` | `0.0.0.0` | Binds to all network interfaces |
   | `PORT` | `5000` | Port listened to by Express (Render maps this to port 443/80) |
   | `SESSION_SECRET` | `generate-a-strong-secret-key-32-chars-long` | Encryption key for admin session cookies |
   | `ADMIN_USERNAME` | `admin` | Your chosen admin username |
   | `ADMIN_PASSWORD` | `YourSecurePassword123` | Your chosen admin password |
   | `PING_INTERVAL_MINUTES` | `5` | Keeps your Render service awake 24/7 |
   | `MONGODB_URI` *(Optional)* | `mongodb+srv://...` | (Optional) MongoDB Atlas URI. If omitted, built-in SQLite is used automatically. |
6. **Click "Create Web Service"**:
   Render will clone your repo, run `npm install`, start `node server.js`, and verify `/health`.

Once deployed, your live URL will be:
- 🌐 **Public Website & Storefront**: `https://<your-service-name>.onrender.com/`
- 🔐 **Admin Login**: `https://<your-service-name>.onrender.com/admin/login`
- 📊 **Admin Dashboard**: `https://<your-service-name>.onrender.com/admin`
- 📦 **Products API**: `https://<your-service-name>.onrender.com/api/products`
- 💓 **Health Check**: `https://<your-service-name>.onrender.com/health`

---

### Method 2: Deploy via Render Blueprint (One-Click IaC)

If you prefer Infrastructure-as-Code:
1. In Render Dashboard, click **New +** > **Blueprint**.
2. Connect your GitHub repository: `https://github.com/sandeepmehta-s/Health-Nutra`.
3. In the **Blueprint Path** field, enter:
   ```text
   backend/render.yaml
   ```
4. Render will parse the configuration file and set up all build steps, health checks, and environment variables automatically.
5. Click **Apply**.

---

### Verifying Production Deployment

1. Open `https://<your-service-name>.onrender.com/health` in your browser. You should see:
   ```json
   { "status": "healthy", "uptime": 12.34 }
   ```
2. Navigate to `https://<your-service-name>.onrender.com/` to view the responsive storefront with 4 starter formulations.
3. Navigate to `https://<your-service-name>.onrender.com/admin/login` and log in with your configured `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
4. Check your Render deployment logs to observe the Keep-Alive cron heartbeat:
   ```text
   [Cron Keep-Alive] Pinged https://<your-service-name>.onrender.com/api/products -> Status 200 (Active Products: 4)
   ```

---

## Seeded Starter Products

| Product Name | Category | Price | Unit | Initial Status | Image Path |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Health Nutra 9G | Multivitamin | ₹235 | Strip | active | /uploads/9g.png |
| Health Nutra 10Q Syrup | Syrup | ₹210 | 200ml | active | /uploads/10q.png |
| Omega-3 Capsules | Omega-3 | ₹499 | Strip | active | /uploads/omega3.png |
| Green Tea Extract | Green Tea | ₹299 | Box | active | /uploads/greentea.png |

---

## Public REST API Endpoints

- `GET /api/products`: Returns JSON array of active products. Supports `?category=...`.
- `GET /api/products/:id`: Returns detailed clinical data for an active formulation.
- `GET /api/categories`: Returns distinct active categories.
- `POST /api/orders`: Place a direct customer order with formulations, address, and payment choice.
- `GET /api/orders/:id`: Customer tracking endpoint by Order ID.
- `GET /health`: Health check endpoint for uptime monitoring and load balancers.
- `GET /api/ping`: Lightweight keep-alive response.

---

## Admin Portal Endpoints (Protected)

- `GET /api/admin/products`: Full catalog with search, filter, and pagination stats.
- `POST /api/admin/products`: Create product formulation (supports file upload OR direct image URL).
- `PUT /api/admin/products/:id`: Update product formulation details or replace image.
- `PATCH /api/admin/products/:id/toggle-status`: Toggle formulation visibility (active / hidden).
- `DELETE /api/admin/products/:id`: Permanently delete formulation and associated uploads.
- `GET /api/admin/orders`: List orders with filtering (all, pending, processing, shipped, delivered, cancelled) and financial stats.
- `GET /api/admin/orders/:id`: Full customer and ordered formulations breakdown.
- `PATCH /api/admin/orders/:id/status`: Update order fulfillment status, payment status, and dispatch notes.
- `DELETE /api/admin/orders/:id`: Remove order record.

---

## Security Architecture

- **Bcrypt Hashing**: Passwords stored as salted bcrypt hashes.
- **Session Authentication**: Server-side session management with HTTP-only cookies.
- **Rate Limiting**: Limits login attempts to 5 tries per 15 minutes to thwart brute-force attacks.
- **Input Sanitization**: Server-side validation and trimming on all inputs.
- **File Upload Limits**: Strict 2MB file size cap and mime-type checks (JPEG, PNG, WebP only).
- **Environment & Database Isolation**: `.env` and `*.sqlite` are excluded via `.gitignore`.

---

## License
Proprietary and confidential. (c) Health Nutra. All rights reserved.
