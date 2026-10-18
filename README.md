# Health Nutra

> **Nurturing Health, Enriching Life**  
> Premium nutraceutical formulations, vitamins, antioxidants, omega fatty acids, and herbal wellness supplements.

---

## 🌟 Key Features

- **Modern Product Catalog**: Categorized showcase of Health Nutra formulations (9G Tablets, 10Q Syrup, Omega-3, Green Tea Extract).
- **Interactive Shopping Cart**: Quantity adjustments, cart badges, and real-time total calculations.
- **Seamless Checkout**: Customer delivery details, Cash on Delivery (COD) workflow, and instant order confirmation receipt.
- **Automated Transactional Emails**: Instant order receipts and enquiry notifications sent via **Brevo API**.
- **Google Sheets / Excel Sync**: Orders and enquiries automatically logged via Google Apps Script.
- **Admin Management Portal**: Protected control panel to add, edit, and manage product inventory.
- **Smart Health Assistant**: Built-in chatbot for product recommendations, pricing, and general inquiries.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router v6
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons**: Lucide React
- **Notifications**: Brevo (Sendinblue) Transactional REST API
- **Backend / Storage**: Google Apps Script & Google Sheets

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/sandeepmehta-s/Health-Nutra.git
cd Health-Nutra
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the example environment file and fill in your keys:
```bash
cp .env.example .env
```

Set the following variables in `.env`:
```env
VITE_BREVO_API_KEY=your_brevo_api_key
VITE_BREVO_SENDER=your-verified-email@domain.com
VITE_ADMIN_EMAIL=your-admin-email@domain.com
VITE_ADMIN_PASS=your-admin-password
VITE_SHEET_URL=https://script.google.com/macros/s/XXXX/exec
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production
```bash
npm run build
```

---

## 📊 Google Sheets Integration (Orders & Enquiries)

1. Create a new Google Sheet.
2. Go to **Extensions** → **Apps Script**.
3. Paste the contents of `google-apps-script/Code.gs` and save.
4. Click **Deploy** → **New deployment** → **Web app**:
   - **Execute as**: Me
   - **Who has access**: Anyone
5. Copy the Web App URL and set it as `VITE_SHEET_URL` in your `.env`.
6. Submissions will automatically append to the **Orders** and **Enquiries** tabs.

---

## 📄 License
This project is proprietary and confidential. © Health Nutra. All rights reserved.
