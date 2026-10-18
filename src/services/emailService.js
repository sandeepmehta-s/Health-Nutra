// Brevo (formerly Sendinblue) transactional email.
const API = "https://api.brevo.com/v3/smtp/email";

export async function sendEmail({ to, subject, html, replyTo }) {
  const apiKey = import.meta.env.VITE_BREVO_API_KEY;
  const senderEmail = import.meta.env.VITE_BREVO_SENDER || "mehtasandeep2019@gmail.com";

  if (!to || !to.includes("@")) {
    console.warn("Invalid recipient email address provided:", to);
    throw new Error(`Invalid recipient email address: "${to}"`);
  }

  const payload = {
    sender: { name: "Health Nutra", email: senderEmail },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  };

  if (replyTo && replyTo.includes("@")) {
    payload.replyTo = { email: replyTo };
  }

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Brevo API error:", res.status, errorText);
    throw new Error(`Email sending failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  console.log("Email dispatched successfully via Brevo:", data);
  return data;
}

export const sendEnquiry = ({ name, email, phone, message }) => {
  const adminEmail =
    import.meta.env.VITE_ADMIN_EMAIL && import.meta.env.VITE_ADMIN_EMAIL.includes("@")
      ? import.meta.env.VITE_ADMIN_EMAIL
      : import.meta.env.VITE_BREVO_SENDER || "mehtasandeep2019@gmail.com";

  return sendEmail({
    to: adminEmail,
    replyTo: email,
    subject: `Health Nutra: New Enquiry from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <div style="background: linear-gradient(135deg, #166534, #047857); padding: 24px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 0.5px;">HEALTH NUTRA</h2>
          <p style="margin: 6px 0 0; font-size: 13px; color: #d1fae5;">New Customer Enquiry Notification</p>
        </div>
        <div style="padding: 24px; background: #ffffff; color: #374151;">
          <p style="font-size: 15px; margin-top: 0; color: #1f2937;">You have received a new enquiry from your website contact form:</p>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin: 18px 0;">
            <p style="margin: 6px 0; font-size: 14px;"><strong>Full Name:</strong> ${name}</p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Email Address:</strong> <a href="mailto:${email}" style="color: #047857;">${email}</a></p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Contact Phone:</strong> <a href="tel:${phone}" style="color: #047857;">${phone}</a></p>
          </div>

          <div style="border-left: 4px solid #f97316; background: #fff7ed; padding: 14px 16px; border-radius: 4px; margin: 18px 0;">
            <p style="margin: 0; font-size: 12px; font-weight: bold; text-transform: uppercase; color: #c2410c;">Customer Message</p>
            <p style="margin: 8px 0 0; font-size: 14px; color: #431407; line-height: 1.6;">${message}</p>
          </div>

          <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #f1f5f9; pt: 12px; text-align: center;">
            Health Nutra Private Limited · Lucknow - 226001
          </p>
        </div>
      </div>
    `,
  });
};

export async function sendOrderEmails(order) {
  const adminEmail =
    import.meta.env.VITE_ADMIN_EMAIL && import.meta.env.VITE_ADMIN_EMAIL.includes("@")
      ? import.meta.env.VITE_ADMIN_EMAIL
      : import.meta.env.VITE_BREVO_SENDER || "mehtasandeep2019@gmail.com";

  const rows = order.lines
    .map(
      (l) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 10px 12px; font-size: 13px; color: #1f2937;">${l.name}</td>
        <td style="padding: 10px 12px; font-size: 13px; color: #4b5563; text-align: center;">${l.qty}</td>
        <td style="padding: 10px 12px; font-size: 13px; color: #166534; font-weight: bold; text-align: right;">₹${l.price * l.qty}</td>
      </tr>`
    )
    .join("");

  const itemsTable = `
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <thead>
        <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; text-align: left;">
          <th style="padding: 10px 12px; font-size: 12px; color: #475569; text-transform: uppercase;">Product</th>
          <th style="padding: 10px 12px; font-size: 12px; color: #475569; text-transform: uppercase; text-align: center;">Qty</th>
          <th style="padding: 10px 12px; font-size: 12px; color: #475569; text-transform: uppercase; text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
      <tfoot>
        <tr style="background: #f0fdf4;">
          <td colspan="2" style="padding: 12px; font-weight: bold; font-size: 14px; color: #166534;">Grand Total (COD)</td>
          <td style="padding: 12px; font-weight: 900; font-size: 16px; color: #166534; text-align: right;">₹${order.total}</td>
        </tr>
      </tfoot>
    </table>
  `;

  // 1. Send receipt to the customer
  if (order.email && order.email.includes("@")) {
    try {
      await sendEmail({
        to: order.email,
        subject: `Order Confirmation - Health Nutra`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
            <div style="background: #166534; padding: 24px; text-align: center; color: #ffffff;">
              <h2 style="margin: 0; font-size: 22px;">HEALTH NUTRA</h2>
              <p style="margin: 4px 0 0; font-size: 13px; color: #d1fae5;">Order Placed Successfully 🎉</p>
            </div>
            <div style="padding: 24px; color: #374151;">
              <h3 style="margin-top: 0; color: #166534;">Thank you, ${order.name}!</h3>
              <p style="font-size: 14px; line-height: 1.5; color: #4b5563;">
                We have received your order and are currently preparing it for dispatch. Payment will be collected via <b>Cash on Delivery (COD)</b> at your doorstep.
              </p>
              ${itemsTable}
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 8px; margin-top: 16px;">
                <p style="margin: 0; font-size: 12px; font-weight: bold; text-transform: uppercase; color: #64748b;">Shipping Destination:</p>
                <p style="margin: 4px 0 0; font-size: 14px; color: #1e293b;">${order.address}</p>
                <p style="margin: 4px 0 0; font-size: 12px; color: #64748b;">Phone: ${order.phone}</p>
              </div>
            </div>
          </div>
        `,
      });
    } catch (e) {
      console.error("Customer order email delivery failed:", e);
    }
  }

  // 2. Send notification to the store administrator
  try {
    await sendEmail({
      to: adminEmail,
      subject: `[New Order] Received from ${order.name} (₹${order.total})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background: #ea580c; padding: 20px; text-align: center; color: #ffffff;">
            <h2 style="margin: 0; font-size: 20px;">HEALTH NUTRA - NEW ORDER ALERT</h2>
          </div>
          <div style="padding: 24px; color: #374151;">
            <p style="font-size: 14px;"><strong>Customer:</strong> ${order.name} (${order.phone}, ${order.email})</p>
            <p style="font-size: 14px;"><strong>Delivery Address:</strong> ${order.address}</p>
            ${itemsTable}
          </div>
        </div>
      `,
    });
  } catch (e) {
    console.error("Admin order notification email failed:", e);
  }
}

