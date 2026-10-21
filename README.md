# healthnutra

Health Nutra is an Ayurvedic and Nutraceuticals e-commerce and clinician portal designed for fast, reliable, and secure online order fulfillment and formulation showcase.

##  Features

- **Storefront & Catalog:** Dynamic product showcase with real-time stock status, categories (Multivitamin, Syrup, Omega-3, Green Tea), and priority search.
- **Secure Ordering:** Server-side price calculation, availability validation, and collision-resistant order ID generation.
- **Admin Management Portal:** Session-authenticated dashboard for formulation catalog management, order status lifecycle updates, and inventory control.
- **High Performance & Security:**
  - Multi-tier in-process TTL cache with LRU eviction.
  - HTTP response compression (gzip/deflate).
  - Helmet security headers and Content Security Policy (CSP).
  - Multi-tier rate limiting for auth and orders.
  - Persistent encrypted sessions using MongoDB (`connect-mongo`).
  - Strict binary signature validation (magic numbers) on image uploads.

## 🛠️ Tech Stack

- **Backend:** Node.js 24 (ESM), Express 5.3
- **Frontend:** React 18, Tailwind CSS, Lucide Icons
- **Database:** MongoDB Atlas via Mongoose 9.11 with SQLite fallback (`node:sqlite`)
- **Hosting:** Render Free Web Service

## 📦 Getting Started

### Prerequisites

- Node.js >= 22.5.0
- npm >= 10.0.0

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/healthnutra16-collab/healthnutra.git
   cd healthnutra
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Set up environment variables:
   Create `backend/.env` with:
   ```env
   PORT=5000
   NODE_ENV=development
   SESSION_SECRET=your-secure-session-secret-here
   ADMIN_USERNAME=your_admin_username
   ADMIN_PASSWORD=your_secure_admin_password
   # Optional: MongoDB connection (falls back to local SQLite if omitted)
   # MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/health_nutra
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Open your browser:
   - **Storefront:** [http://localhost:5000/](http://localhost:5000/)
   - **Admin Portal:** [http://localhost:5000/admin](http://localhost:5000/admin)
   - **Health Check:** [http://localhost:5000/health](http://localhost:5000/health)

## 🧪 Testing

Run the full automated test suite (unit, negative, regression, load, and security):

```bash
cd backend
npm test
```

## 📄 License

Proprietary © Health Nutra. All rights reserved.
