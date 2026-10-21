/**
 * Health Nutra - Transactional Email & Notification Service (Brevo / SMTP)
 * Sends notification emails for customer inquiries and orders using Brevo REST API
 * (cloud-compatible on Render without port 587 blocks) or SMTP relay.
 */

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

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

  const siteUrl = (process.env.APP_URL || "https://healthnutra.co.in").replace(/\/$/, "");

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
        Health Nutra Administration • Manage enquiries at <a href="${siteUrl}/admin">Admin Console</a>
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
  const siteUrl = (process.env.APP_URL || "https://healthnutra.co.in").replace(/\/$/, "");

  // 1. Send confirmation to customer if email provided
  if (order.customerEmail) {
    const customerSubject = `Order Confirmed #${order.orderId} - Health Nutra`;
    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
        <div style="background: #166534; color: #ffffff; padding: 20px; border-radius: 8px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px;">HEALTH NUTRA™</h1>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #bbf7d0;">Order Confirmation & Receipt</p>
        </div>
        <div style="padding: 20px 0;">
          <p style="font-size: 14px; color: #1e293b;">Dear <strong>${order.customerName}</strong>,</p>
          <p style="font-size: 13px; color: #475569;">Thank you for your order! Your health formulation package has been scheduled for dispatch.</p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin: 16px 0;">
            <div style="font-size: 13px; font-weight: bold; color: #0f172a;">Order Reference: #${order.orderId}</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Total Amount: <strong>₹${order.totalAmount}</strong> | Mode: ${order.paymentMethod || "COD"}</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Delivery Address: ${order.shippingAddress}, ${order.city || ""} - ${order.pincode || ""}</div>
          </div>
          <p style="font-size: 12px; color: #64748b;">You can track your live shipment anytime at: <a href="${siteUrl}/">${siteUrl}/</a> using your Order ID <strong>#${order.orderId}</strong>.</p>
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 14px; font-size: 11px; color: #94a3b8; text-align: center;">
          Marketed by: HEALTH NUTRA™ • Shop No/ Plot No.: 247, SLICE-2, SECTOR-A, SCHEME NO 78, INDORE - 452010 Dist.-INDORE (M.P.)<br>
          Customer Support: +91-7024308660 | healthnutra16@gmail.com
        </div>
      </div>
    `;
    sendEmail({ to: order.customerEmail, subject: customerSubject, htmlContent: customerHtml }).catch(() => {});
  }

  // 2. Send notification to admin
  const adminSubject = `[New Order] #${order.orderId} placed by ${order.customerName} (₹${order.totalAmount})`;
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <h2 style="color: #166534; margin-top: 0;">📦 New Customer Order Placed</h2>
      <p><strong>Order ID:</strong> #${order.orderId}</p>
      <p><strong>Customer:</strong> ${order.customerName} (${order.customerPhone})</p>
      <p><strong>Total:</strong> ₹${order.totalAmount} (${order.paymentMethod})</p>
      <p><strong>Address:</strong> ${order.shippingAddress}</p>
      <p><a href="${siteUrl}/admin" style="display: inline-block; background: #166534; color: #ffffff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 13px;">View in Admin Portal</a></p>
    </div>
  `;
  sendEmail({ to: adminEmail, subject: adminSubject, htmlContent: adminHtml }).catch(() => {});
}

