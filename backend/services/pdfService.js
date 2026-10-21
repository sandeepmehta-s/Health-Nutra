import PDFDocument from "pdfkit";

/**
 * Health Nutra - Official Order Tax Invoice PDF Generator
 * Generates an executive, pharmaceutical-grade PDF invoice buffer.
 *
 * @param {Object} order - Full order object from MongoDB / memory store
 * @returns {Promise<Buffer>} - Resolves to the binary PDF buffer
 */
export async function generateInvoicePdfBuffer(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 40,
        info: {
          Title: `Tax Invoice #${order.orderId || order.id || "HN-ORD"}`,
          Author: "Health Nutra",
          Subject: "Official Tax Invoice & Receipt",
          Keywords: "Health Nutra, Invoice, Pharmaceutical, Nutraceutical",
          CreationDate: new Date(order.createdAt || Date.now()),
        },
      });

      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      const orderId = order.orderId || order.id || "HN-ORD-N/A";
      const createdAt = order.createdAt
        ? new Date(order.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : new Date().toLocaleDateString("en-IN");

      const items =
        order.items && Array.isArray(order.items) && order.items.length > 0
          ? order.items
          : [
              {
                name: order.productName || "Nutra Dietary Formulation",
                quantity: order.quantity || 1,
                price: order.unitPrice || order.totalAmount || 0,
                unit: "Strip",
              },
            ];

      const customerName = order.customerName || "Valued Customer";
      const customerPhone = order.customerPhone || "-";
      const customerEmail = order.customerEmail || "-";
      const shippingAddress =
        `${order.shippingAddress || ""}${order.city ? `, ${order.city}` : ""}${order.pincode ? ` - ${order.pincode}` : ""}` ||
        "Delivery Area Verified";
      const paymentMethod = order.paymentMethod || "Cash on Delivery (COD)";
      const totalAmount = parseFloat(order.totalAmount || 0).toFixed(2);

      // ── 1. Brand Header ───────────────────────────────────────────
      // Top Green Accent Bar
      doc.rect(40, 40, 515, 4).fill("#166534");

      // Brand Title & Tagline
      doc
        .fillColor("#166534")
        .font("Helvetica-Bold")
        .fontSize(22)
        .text("HEALTH NUTRA™", 40, 55, { align: "left" });

      doc
        .fillColor("#64748b")
        .font("Helvetica")
        .fontSize(9)
        .text("PHARMACEUTICAL & BOTANICAL FORMULATIONS", 40, 80);

      // Invoice Badge (Right aligned)
      doc
        .fillColor("#0f172a")
        .font("Helvetica-Bold")
        .fontSize(15)
        .text("OFFICIAL TAX INVOICE", 320, 55, { align: "right", width: 235 });

      doc
        .fillColor("#166534")
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(`#${orderId}`, 320, 75, { align: "right", width: 235 });

      doc
        .fillColor("#64748b")
        .font("Helvetica")
        .fontSize(9)
        .text(`Date: ${createdAt}`, 320, 90, { align: "right", width: 235 });

      // Divider Line
      doc.moveTo(40, 108).lineTo(555, 108).strokeColor("#e2e8f0").lineWidth(1).stroke();

      // ── 2. Two-Column Address & Details ────────────────────────────
      const boxY = 120;
      const boxHeight = 110;
      const colWidth = 248;

      // Left Box: Marketed & Dispatched By
      doc.roundedRect(40, boxY, colWidth, boxHeight, 6).fillColor("#f8fafc").fill();
      doc.roundedRect(40, boxY, colWidth, boxHeight, 6).strokeColor("#e2e8f0").lineWidth(0.8).stroke();

      doc
        .fillColor("#64748b")
        .font("Helvetica-Bold")
        .fontSize(8)
        .text("MARKETED & DISPATCHED BY", 50, boxY + 8);

      doc
        .fillColor("#0f172a")
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("HEALTH NUTRA™", 50, boxY + 22);

      doc
        .fillColor("#475569")
        .font("Helvetica")
        .fontSize(8.5)
        .text(
          "Shop No/ Plot No.: 247, SLICE-2, SECTOR-A,\nSCHEME NO 78, INDORE - 452010 (M.P.)\nHotline: +91-7024308660\nEmail: healthnutra16@gmail.com",
          50,
          boxY + 36,
          { width: colWidth - 20, lineGap: 2 }
        );

      // Right Box: Customer & Delivery Details
      const rightColX = 307;
      doc.roundedRect(rightColX, boxY, colWidth, boxHeight, 6).fillColor("#f8fafc").fill();
      doc.roundedRect(rightColX, boxY, colWidth, boxHeight, 6).strokeColor("#e2e8f0").lineWidth(0.8).stroke();

      doc
        .fillColor("#64748b")
        .font("Helvetica-Bold")
        .fontSize(8)
        .text("BILLED & SHIPPED TO", rightColX + 10, boxY + 8);

      doc
        .fillColor("#0f172a")
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(customerName, rightColX + 10, boxY + 22);

      doc
        .fillColor("#475569")
        .font("Helvetica")
        .fontSize(8.5)
        .text(
          `Phone: ${customerPhone}\nEmail: ${customerEmail}\nAddress: ${shippingAddress}`,
          rightColX + 10,
          boxY + 36,
          { width: colWidth - 20, lineGap: 2 }
        );

      // ── 3. Line Items Table ───────────────────────────────────────
      const tableTop = 246;
      doc.rect(40, tableTop, 515, 22).fillColor("#f1f5f9").fill();

      // Column definitions: Item (235), Unit (60), Rate (70), Qty (50), Total (100)
      doc
        .fillColor("#475569")
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .text("FORMULATION ITEM", 48, tableTop + 6)
        .text("UNIT", 280, tableTop + 6, { width: 50, align: "center" })
        .text("RATE (INR)", 335, tableTop + 6, { width: 65, align: "right" })
        .text("QTY", 410, tableTop + 6, { width: 40, align: "center" })
        .text("AMOUNT (INR)", 455, tableTop + 6, { width: 90, align: "right" });

      let currentY = tableTop + 24;

      items.forEach((it) => {
        const p = parseFloat(it.price) || 0;
        const q = parseInt(it.quantity, 10) || 1;
        const lineTotal = (p * q).toFixed(2);

        doc.rect(40, currentY, 515, 24).fillColor(currentY % 48 === 0 ? "#ffffff" : "#fafafa").fill();
        doc.moveTo(40, currentY + 24).lineTo(555, currentY + 24).strokeColor("#f1f5f9").lineWidth(0.8).stroke();

        doc
          .fillColor("#0f172a")
          .font("Helvetica-Bold")
          .fontSize(9)
          .text(it.name || "Nutra Dietary Formulation", 48, currentY + 7, { width: 230 });

        doc
          .fillColor("#64748b")
          .font("Helvetica")
          .fontSize(8.5)
          .text(it.unit || "Strip", 280, currentY + 7, { width: 50, align: "center" });

        doc
          .fillColor("#334155")
          .font("Helvetica")
          .fontSize(9)
          .text(`Rs. ${p.toFixed(2)}`, 335, currentY + 7, { width: 65, align: "right" });

        doc
          .fillColor("#0f172a")
          .font("Helvetica-Bold")
          .fontSize(9)
          .text(String(q), 410, currentY + 7, { width: 40, align: "center" });

        doc
          .fillColor("#0f172a")
          .font("Helvetica-Bold")
          .fontSize(9)
          .text(`Rs. ${lineTotal}`, 455, currentY + 7, { width: 90, align: "right" });

        currentY += 24;
      });

      // ── 4. Grand Total Summary ────────────────────────────────────
      currentY += 10;
      doc.rect(40, currentY, 515, 34).fillColor("#f8fafc").fill();
      doc.rect(40, currentY, 515, 34).strokeColor("#cbd5e1").lineWidth(1).stroke();

      doc
        .fillColor("#334155")
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(`Payment Mode: ${paymentMethod}`, 50, currentY + 11);

      doc
        .fillColor("#166534")
        .font("Helvetica-Bold")
        .fontSize(13)
        .text(`Grand Total: Rs. ${totalAmount}`, 320, currentY + 10, {
          align: "right",
          width: 225,
        });

      // ── 5. Certifications & Badges ────────────────────────────────
      currentY += 50;
      const certBoxY = currentY;

      doc.roundedRect(40, certBoxY, 515, 48, 6).fillColor("#f0fdf4").fill();
      doc.roundedRect(40, certBoxY, 515, 48, 6).strokeColor("#bbf7d0").lineWidth(0.8).stroke();

      doc
        .fillColor("#166534")
        .font("Helvetica-Bold")
        .fontSize(9)
        .text("QUALITY & REGULATORY ASSURANCE", 50, certBoxY + 9);

      doc
        .fillColor("#15803d")
        .font("Helvetica")
        .fontSize(8)
        .text(
          "Manufactured & Marketed under WHO-GMP & ISO 9001:2015 certified pharmaceutical processes.\nEvery batch undergoes rigorous HPLC analytical testing for purity, potency, and dissolution.",
          50,
          certBoxY + 22,
          { width: 495, lineGap: 2 }
        );

      // ── 6. Official Footer ────────────────────────────────────────
      const footerY = 720;
      doc.moveTo(40, footerY).lineTo(555, footerY).strokeColor("#e2e8f0").lineWidth(1).stroke();

      doc
        .fillColor("#64748b")
        .font("Helvetica")
        .fontSize(8)
        .text(
          "This is a computer-generated tax invoice and requires no physical signature.\nMarketed by: HEALTH NUTRA™ • TM TRADEMARK APPLIED FOR • Scheme No 78, Indore - 452010 (M.P.)\nSupport Hotline: +91-7024308660 | Email: healthnutra16@gmail.com | Website: https://healthnutra.co.in",
          40,
          footerY + 10,
          { align: "center", width: 515, lineGap: 3 }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

