/**
 * Health Nutra - Official Order Invoice & PDF Receipt Generator
 * Generates a clean, pharmaceutical-grade printable PDF invoice with order status,
 * customer information, item breakdown, WHO-GMP certification seal, and barcodes.
 */

export function downloadOrderInvoicePDF(order) {
  if (!order) return;

  const orderId = order.orderId || order.id || "HN-ORD-PENDING";
  const customerName = order.customerName || "Valued Customer";
  const customerPhone = order.customerPhone || "N/A";
  const customerEmail = order.customerEmail || "N/A";
  const shippingAddress = order.shippingAddress || "Doorstep Delivery Address";
  const paymentMethod = order.paymentMethod || "Cash on Delivery (COD)";
  const orderStatus = (order.orderStatus || order.status || "Pending").toUpperCase();
  const totalAmount = order.totalAmount || 0;
  const createdAt = order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" }) : new Date().toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" });

  const items = Array.isArray(order.items) && order.items.length > 0 ? order.items : [
    {
      name: order.productName || "Health Nutra Formulation",
      quantity: order.quantity || 1,
      price: order.unitPrice || totalAmount,
      unit: order.unit || "Unit",
    }
  ];

  const statusColors = {
    PENDING: "#ea580c",
    CONFIRMED: "#2563eb",
    SHIPPED: "#7c3aed",
    DELIVERED: "#16a34a",
    CANCELLED: "#dc2626",
  };

  const statusBg = {
    PENDING: "#fff7ed",
    CONFIRMED: "#eff6ff",
    SHIPPED: "#f5f3ff",
    DELIVERED: "#f0fdf4",
    CANCELLED: "#fef2f2",
  };

  const statusColor = statusColors[orderStatus] || "#166534";
  const statusBgColor = statusBg[orderStatus] || "#f0fdf4";

  // Build Printable HTML Document
  const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice #${orderId} - Health Nutra</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background: #f8fafc;
      color: #1e293b;
      padding: 30px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    .invoice-card {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
    }
    
    .invoice-header {
      background: linear-gradient(135deg, #14532d 0%, #166534 60%, #15803d 100%);
      color: #ffffff;
      padding: 36px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .brand-title {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    
    .brand-title span {
      color: #fb923c;
    }
    
    .brand-tagline {
      font-size: 11px;
      color: #bbf7d0;
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 700;
    }
    
    .invoice-badge-box {
      text-align: right;
    }
    
    .invoice-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #86efac;
      font-weight: 700;
    }
    
    .invoice-number {
      font-size: 20px;
      font-weight: 800;
      color: #ffffff;
      margin-top: 2px;
    }
    
    .invoice-body {
      padding: 36px 40px;
    }
    
    .status-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: ${statusBgColor};
      border: 1px solid ${statusColor}40;
      padding: 14px 20px;
      border-radius: 16px;
      margin-bottom: 28px;
    }
    
    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: ${statusColor};
      color: #ffffff;
      font-size: 12px;
      font-weight: 800;
      padding: 6px 16px;
      border-radius: 999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .order-date {
      font-size: 12px;
      font-weight: 600;
      color: #475569;
    }
    
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
    }
    
    .meta-box {
      background: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 16px;
      padding: 20px;
    }
    
    .meta-box-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748b;
      margin-bottom: 8px;
    }
    
    .meta-box-name {
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
    }
    
    .meta-box-text {
      font-size: 12px;
      color: #475569;
      margin-top: 4px;
      line-height: 1.5;
    }
    
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    
    .items-table th {
      background: #f8fafc;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #475569;
      text-align: left;
      padding: 12px 16px;
      border-top: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .items-table td {
      padding: 16px;
      font-size: 13px;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
    }
    
    .items-table td.qty {
      font-weight: 700;
      color: #0f172a;
    }
    
    .items-table td.price {
      font-weight: 800;
      text-align: right;
      color: #0f172a;
    }
    
    .totals-area {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 32px;
    }
    
    .totals-box {
      width: 300px;
    }
    
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 13px;
      color: #64748b;
    }
    
    .totals-row.grand-total {
      border-top: 2px solid #e2e8f0;
      margin-top: 8px;
      padding-top: 12px;
      font-size: 18px;
      font-weight: 800;
      color: #166534;
    }
    
    .invoice-footer {
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 24px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #64748b;
    }
    
    .cert-pills {
      display: flex;
      gap: 8px;
    }
    
    .cert-pill {
      border: 1px solid #cbd5e1;
      padding: 4px 10px;
      border-radius: 999px;
      font-weight: 700;
      background: #ffffff;
      color: #334155;
    }
    
    .no-print-bar {
      max-width: 800px;
      margin: 0 auto 20px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .print-btn {
      background: #166534;
      color: white;
      border: none;
      padding: 10px 24px;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      font-size: 13px;
    }
    
    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }
      .no-print-bar {
        display: none !important;
      }
      .invoice-card {
        border: none;
        box-shadow: none;
        border-radius: 0;
      }
    }
  </style>
</head>
<body>

  <div class="no-print-bar">
    <div style="font-size: 13px; font-weight: 700; color: #475569;">
      Health Nutra Official Invoice
    </div>
    <button class="print-btn" onclick="window.print()">
      🖨️ Click to Print / Save as PDF
    </button>
  </div>

  <div class="invoice-card">
    
    <!-- Top Header -->
    <div class="invoice-header">
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="width: 58px; height: 58px; background: #ffffff; border-radius: 16px; padding: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;">
          <img src="https://res.cloudinary.com/usqwgkl7/image/upload/v1792576055/logo.jpg" alt="Health Nutra Logo" style="width: 100%; height: 100%; object-fit: contain;" />
        </div>
        <div>
          <div class="brand-title">HEALTH <span>NUTRA</span>™</div>
          <div class="brand-tagline">Nurturing Health, Enriching Life • WHO-GMP Certified</div>
        </div>
      </div>
      <div class="invoice-badge-box">
        <div class="invoice-label">Official Order Invoice</div>
        <div class="invoice-number">#${orderId}</div>
      </div>
    </div>

    <!-- Body -->
    <div class="invoice-body">
      
      <!-- Status Banner -->
      <div class="status-bar">
        <div>
          <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Current Live Status</span>
          <div style="margin-top: 4px;">
            <span class="status-pill">${orderStatus}</span>
          </div>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Placed On</span>
          <div class="order-date">${createdAt}</div>
        </div>
      </div>

      <!-- Customer & Shipping Grid -->
      <div class="meta-grid">
        <div class="meta-box">
          <div class="meta-box-title">Billed & Shipped To:</div>
          <div class="meta-box-name">${customerName}</div>
          <div class="meta-box-text">
            <strong>Phone:</strong> ${customerPhone}<br>
            <strong>Email:</strong> ${customerEmail}<br>
            <strong>Address:</strong> ${shippingAddress}
          </div>
        </div>

        <div class="meta-box">
          <div class="meta-box-title">Marketed & Dispatched By:</div>
          <div class="meta-box-name">HEALTH NUTRA™</div>
          <div class="meta-box-text">
            Shop No/ Plot No.: 247, SLICE-2,<br>
            SECTOR-A, SCHEME NO 78,<br>
            INDORE - 452010 Dist.-INDORE (M.P.)<br>
            <strong>Phone:</strong> +91 8809672959 / +91 7024308660<br>
            <strong>Email:</strong> healthnutra16@gmail.com<br>
            <span style="font-size: 10px; color: #64748b; font-weight: 700;">TM TRADEMARK APPLIED FOR</span>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <table class="items-table">
        <thead>
          <tr>
            <th>Item Formulation Description</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Unit Price</th>
            <th style="text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(it => `
            <tr>
              <td>
                <strong style="color: #0f172a; font-size: 14px;">${it.name || it.productName || "Health Nutra Formulation"}</strong>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Prescription/Nutraceutical Grade • Unit: ${it.unit || "Pack"}</div>
              </td>
              <td class="qty" style="text-align: center;">${it.quantity || 1}</td>
              <td style="text-align: right; color: #475569;">₹${it.price || totalAmount}</td>
              <td class="price">₹${(it.price || totalAmount) * (it.quantity || 1)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <!-- Totals -->
      <div class="totals-area">
        <div class="totals-box">
          <div class="totals-row">
            <span>Subtotal:</span>
            <span style="font-weight: 700; color: #0f172a;">₹${totalAmount}</span>
          </div>
          <div class="totals-row">
            <span>Pharmaceutical Taxes (GST 0%):</span>
            <span style="font-weight: 700; color: #0f172a;">₹0.00</span>
          </div>
          <div class="totals-row">
            <span>Standard Express Shipping:</span>
            <span style="font-weight: 700; color: #16a34a;">FREE</span>
          </div>
          <div class="totals-row grand-total">
            <span>Total Payable:</span>
            <span>₹${totalAmount}</span>
          </div>
        </div>
      </div>

      <div style="font-size: 11px; color: #94a3b8; line-height: 1.5; border-top: 1px solid #f1f5f9; padding-top: 16px;">
        * This document is a computer-generated tax invoice for nutritional formulations supplied under license. Keep this invoice for any warranty or exchange requests.
      </div>

    </div>

    <!-- Footer -->
    <div class="invoice-footer">
      <div>
        <strong>Health Nutra Care:</strong> healthnutra16@gmail.com | +91 8809672959 / +91 7024308660<br>
        <span style="font-size: 10px; color: #64748b;">Plot 247, Slice-2, Sector-A, Scheme 78, Indore - 452010 Dist.-Indore (M.P.)</span>
      </div>
      <div class="cert-pills">
        <span class="cert-pill">WHO-GMP</span>
        <span class="cert-pill">ISO 9001:2015</span>
        <span class="cert-pill">BATCH VERIFIED</span>
      </div>
    </div>

  </div>

</body>
</html>
  `;

  // 1-Click Direct Binary PDF Download via API endpoint
  try {
    const downloadUrl = `/api/orders//invoice/download`;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `HealthNutra_Invoice_.pdf`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => document.body.removeChild(a), 300);
    return;
  } catch (err) {
    console.warn("Fallback to browser print:", err.message);
  }

  // Fallback: Open invoice in new window
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    setTimeout(() => { printWindow.focus(); printWindow.print(); }, 400);
  }
}

if (typeof window !== "undefined") {
  window.downloadOrderInvoicePDF = downloadOrderInvoicePDF;
}
if (typeof exports !== "undefined") {
  exports.downloadOrderInvoicePDF = downloadOrderInvoicePDF;
}
