/**
 * Health Nutra - Transactional Email & Notification Service (Brevo / SMTP)
 * Sends notification emails for customer inquiries and orders using Brevo REST API
 * (cloud-compatible on Render without port 587 blocks) or SMTP relay.
 */

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export function getProductionBaseUrl() {
  const envUrl = (process.env.APP_URL || "").trim().replace(/\/$/, "");
  // Force actual production domain if environment has localhost or is missing
  if (!envUrl || envUrl.includes("localhost") || envUrl.includes("127.0.0.1")) {
    return "https://healthnutra.co.in";
  }
  return envUrl;
}

export function isEmailConfigured() {
  const apiKey =
    process.env.BREVO_API_KEY ||
    process.env.VITE_BREVO_API_KEY ||
    process.env.SMTP_PASS;
  return Boolean(apiKey && apiKey.startsWith("xkeysib-"));
}

/**
 * Send Transactional Email via Brevo API
 */
export async function sendEmail({ to, subject, htmlContent, textContent, senderName, senderEmail }) {
  const apiKey =
    process.env.BREVO_API_KEY ||
    process.env.VITE_BREVO_API_KEY ||
    process.env.SMTP_PASS;

  if (!apiKey || !apiKey.startsWith("xkeysib-")) {
    console.log(`[Email Service] Simulated send to ${to}: "${subject}" (API key not configured)`);
    return { success: false, simulated: true, message: "Brevo API key not configured." };
  }

  const sender = {
    name: senderName || "Health Nutra",
    email: senderEmail || process.env.BREVO_SENDER || process.env.VITE_BREVO_SENDER || "healthnutra16@gmail.com",
  };

  const recipientList = Array.isArray(to)
    ? to.map((e) => (typeof e === "string" ? { email: e } : e))
    : [{ email: to }];

  // Ensure robust non-empty textContent fallback to satisfy Brevo API requirements
  const plainText =
    (textContent && typeof textContent === "string" && textContent.trim()) ||
    (htmlContent ? htmlContent.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "") ||
    subject ||
    "Health Nutra Notification";

  const payload = {
    sender,
    to: recipientList,
    subject: subject || "Health Nutra Notification",
    htmlContent: htmlContent || `<p>${plainText}</p>`,
    textContent: plainText,
  };

  try {
    const res = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      console.log(`[Email Service] Sent email to ${recipientList.map((r) => r.email).join(", ")} - Subject: "${subject}" (Message ID: ${data.messageId || "N/A"})`);
      return { success: true, messageId: data.messageId };
    } else {
      if (res.status === 401 && (data.message || "").includes("unrecognised IP address")) {
        console.warn(`[Email Service] Brevo IP Restriction: Please disable IP restriction or authorise server IP in Brevo: https://app.brevo.com/security/authorised_ips`);
      } else {
        console.error(`[Email Service] Brevo API Error (${res.status}):`, data.message || res.statusText);
      }
      return { success: false, error: data.message || "Failed to send email." };
    }
  } catch (err) {
    console.error("[Email Service] Network error sending email:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Notify admin of a new contact inquiry
 */
export async function sendEnquiryNotification(enquiry) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.VITE_ADMIN_EMAIL || "healthnutra16@gmail.com";
  const subject = `[Health Nutra Lead] New Enquiry from ${enquiry.name} (${enquiry.subject || "General"})`;

  const siteUrl = getProductionBaseUrl();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <div style="background: #166534; color: #ffffff; padding: 16px 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="margin: 0; font-size: 18px;">🌿 Health Nutra - New Customer Inquiry</h2>
      </div>
      <p style="font-size: 14px; color: #334155;">A new customer lead was submitted on the website:</p>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 16px 0;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 120px;">Name:</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${enquiry.name}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${enquiry.email}">${enquiry.email}</a></td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9;"><a href="tel:${enquiry.phone}">${enquiry.phone || "Not provided"}</a></td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Subject:</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${enquiry.subject || "General Inquiry"}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; vertical-align: top;">Message:</td><td style="padding: 8px; white-space: pre-line;">${enquiry.message}</td></tr>
      </table>
      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center;">
        Health Nutra Administration • Manage enquiries at <a href="${siteUrl}/admin" style="color: #166534; font-weight: bold;">Admin Console</a>
      </div>
    </div>
  `;

  return sendEmail({ to: adminEmail, subject, htmlContent });
}

/**
 * Notify customer and admin of a new order placement
 */
export async function sendOrderNotifications(order) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.VITE_ADMIN_EMAIL || "healthnutra16@gmail.com";
  const siteUrl = getProductionBaseUrl();
  const invoiceUrl = `${siteUrl}/api/orders/${order.orderId}/invoice`;

  // Format Items table
  const items = order.items && Array.isArray(order.items) ? order.items : [];
  const itemsRows = items.map(it => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #1e293b;">
        <strong>${it.name || "Nutra Formulation"}</strong>
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 12px; text-align: center; color: #64748b;">
        ${it.unit || "Unit"}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 12px; text-align: center; color: #1e293b; font-weight: bold;">
        ${it.quantity || 1}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 12px; text-align: right; color: #166534; font-weight: bold;">
        ₹${((it.price || 0) * (it.quantity || 1)).toFixed(2)}
      </td>
    </tr>
  `).join("");

  // 1. Send confirmation to customer if email provided
  if (order.customerEmail) {
    const customerSubject = `Order Confirmed #${order.orderId} - Health Nutra Official Tax Invoice`;
    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); color: #ffffff; padding: 24px; border-radius: 12px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; letter-spacing: 0.5px;">HEALTH NUTRA™</h1>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #bbf7d0; font-weight: bold;">Order Confirmation & Official Receipt</p>
        </div>

        <div style="padding: 24px 8px;">
          <p style="font-size: 15px; color: #1e293b; margin-top: 0;">Dear <strong>${order.customerName}</strong>,</p>
          <p style="font-size: 13px; color: #475569; line-height: 1.6;">Thank you for choosing Health Nutra! Your pharmaceutical-grade dietary formulation has been received and scheduled for priority dispatch.</p>

          <!-- Order Summary Card -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 12px;">
              <div>
                <span style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Order Reference:</span>
                <div style="font-size: 15px; font-weight: 900; color: #166534; font-family: monospace;">#${order.orderId}</div>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b;">Payment Mode:</span>
                <div style="font-size: 13px; font-weight: bold; color: #ea580c;">${order.paymentMethod || "Cash on Delivery (COD)"}</div>
              </div>
            </div>

            <!-- Ordered Items Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
              <thead>
                <tr style="background: #f1f5f9;">
                  <th style="padding: 6px 8px; font-size: 11px; text-align: left; color: #475569; text-transform: uppercase;">Item</th>
                  <th style="padding: 6px 8px; font-size: 11px; text-align: center; color: #475569; text-transform: uppercase;">Unit</th>
                  <th style="padding: 6px 8px; font-size: 11px; text-align: center; color: #475569; text-transform: uppercase;">Qty</th>
                  <th style="padding: 6px 8px; font-size: 11px; text-align: right; color: #475569; text-transform: uppercase;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows || `<tr><td colspan="4" style="padding: 8px; font-size: 12px;">Health Nutra Formulation</td></tr>`}
              </tbody>
            </table>

            <div style="border-top: 2px solid #cbd5e1; padding-top: 10px; font-size: 14px; text-align: right; color: #0f172a;">
              Grand Total: <strong style="font-size: 18px; color: #166534;">₹${order.totalAmount}</strong>
            </div>

            <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #475569;">
              <strong>Delivery Address:</strong> ${order.shippingAddress}${order.city ? `, ${order.city}` : ""}${order.pincode ? ` - ${order.pincode}` : ""}
            </div>
          </div>

          <!-- Action Buttons: Download PDF Invoice & Live Tracking -->
          <div style="text-align: center; margin: 24px 0 16px 0;">
            <a href="${invoiceUrl}" target="_blank" style="display: inline-block; background: #166534; color: #ffffff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-size: 13px; font-weight: bold; margin: 4px; box-shadow: 0 2px 4px rgba(22, 101, 52, 0.2);">
              📄 Download & Print Official PDF Invoice
            </a>
            <a href="${siteUrl}/" target="_blank" style="display: inline-block; background: #f8fafc; color: #334155; padding: 12px 20px; border-radius: 10px; text-decoration: none; font-size: 13px; font-weight: bold; border: 1px solid #cbd5e1; margin: 4px;">
              🚚 Track Live Shipment
            </a>
          </div>

          <p style="font-size: 12px; color: #64748b; line-height: 1.5; text-align: center;">
            You can also track your live shipment anytime at <a href="${siteUrl}/" style="color: #166534; font-weight: bold;">${siteUrl}</a> using your Order ID <strong>#${order.orderId}</strong>.
          </p>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.6;">
          <strong>Marketed by: HEALTH NUTRA™</strong> • TM TRADEMARK APPLIED FOR<br>
          Shop No/ Plot No.: 247, SLICE-2, SECTOR-A, SCHEME NO 78, INDORE - 452010 Dist.-INDORE (M.P.)<br>
          Customer Support: <a href="tel:+917024308660" style="color: #166534; font-weight: bold; text-decoration: none;">+91-7024308660</a> | <a href="mailto:healthnutra16@gmail.com" style="color: #166534; font-weight: bold; text-decoration: none;">healthnutra16@gmail.com</a>
        </div>
      </div>
    `;
    sendEmail({ to: order.customerEmail, subject: customerSubject, htmlContent: customerHtml }).catch(() => {});
  }

  // 2. Send notification to admin (orders management)
  const adminSubject = `[New Order] #${order.orderId} placed by ${order.customerName} (₹${order.totalAmount})`;
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <div style="background: #166534; color: #ffffff; padding: 16px 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="margin: 0; font-size: 18px;">📦 New Customer Order Placed</h2>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 16px 0;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 140px;">Order ID:</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-family: monospace; font-weight: bold; color: #166534;">#${order.orderId}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Customer:</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${order.customerName}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9;"><a href="tel:${order.customerPhone}">${order.customerPhone}</a></td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${order.customerEmail || "Not provided"}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Total Amount:</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #0f172a;">₹${order.totalAmount} (${order.paymentMethod || "COD"})</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Shipping Address:</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${order.shippingAddress}${order.city ? `, ${order.city}` : ""}${order.pincode ? ` - ${order.pincode}` : ""}</td></tr>
      </table>
      <div style="margin: 20px 0; text-align: center;">
        <a href="${siteUrl}/admin" style="display: inline-block; background: #166534; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: bold; margin: 4px;">View in Admin Portal</a>
        <a href="${invoiceUrl}" target="_blank" style="display: inline-block; background: #f8fafc; color: #334155; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: bold; border: 1px solid #cbd5e1; margin: 4px;">Print Tax Invoice</a>
      </div>
      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
        Health Nutra Order Management • ${siteUrl}
      </div>
    </div>
  `;

  return sendEmail({ to: adminEmail, subject: adminSubject, htmlContent: adminHtml });
}
