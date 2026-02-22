import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  cc?: string;
  bcc?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from:
        options.from ||
        `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      ...options,
    });
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
}

export function getQuoteEmailTemplate(
  customerName: string,
  quoteNumber: string,
  totalAmount: number,
  validUntil: string,
  quoteLink: string,
): string {
  return `
    <h2>Your Solar Quote is Ready!</h2>
    <p>Dear ${customerName},</p>
    <p>We're excited to present your customized solar energy quote.</p>
    <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <p><strong>Quote Number:</strong> ${quoteNumber}</p>
      <p><strong>Total Amount:</strong> ₹${totalAmount.toLocaleString("en-IN")}</p>
      <p><strong>Valid Until:</strong> ${validUntil}</p>
    </div>
    <p>
      <a href="${quoteLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        View Full Quote
      </a>
    </p>
    <p>If you have any questions, please don't hesitate to contact us.</p>
    <p>Best regards,<br>Solar Store Team</p>
  `;
}

export function getOrderConfirmationEmailTemplate(
  customerName: string,
  orderNumber: string,
  totalAmount: number,
  items: any[],
): string {
  const itemsList = items
    .map(
      (item) =>
        `<tr><td>${item.productName}</td><td>${item.quantity}</td><td>₹${item.price}</td><td>₹${item.quantity * item.price}</td></tr>`,
    )
    .join("");

  return `
    <h2>Order Confirmation</h2>
    <p>Dear ${customerName},</p>
    <p>Thank you for your order!</p>
    <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <p><strong>Order Number:</strong> ${orderNumber}</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #ddd;">
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
        ${itemsList}
        <tr style="background-color: #f9f9f9; font-weight: bold;">
          <td colspan="3">Total Amount:</td>
          <td>₹${totalAmount.toLocaleString("en-IN")}</td>
        </tr>
      </table>
    </div>
    <p>You will be notified about shipping details soon.</p>
    <p>Best regards,<br>Solar Store Team</p>
  `;
}

export function getInvoiceEmailTemplate(
  customerName: string,
  invoiceNumber: string,
  totalAmount: number,
  dueDate: string,
  downloadLink: string,
): string {
  return `
    <h2>Invoice ${invoiceNumber}</h2>
    <p>Dear ${customerName},</p>
    <p>Please find your invoice attached below.</p>
    <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
      <p><strong>Total Amount:</strong> ₹${totalAmount.toLocaleString("en-IN")}</p>
      <p><strong>Due Date:</strong> ${dueDate}</p>
    </div>
    <p>
      <a href="${downloadLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Download Invoice (PDF)
      </a>
    </p>
    <p>Thank you for your business!</p>
    <p>Best regards,<br>Solar Store Team</p>
  `;
}

export function getServiceBookingEmailTemplate(
  customerName: string,
  bookingNumber: string,
  serviceName: string,
  scheduledDate: string,
): string {
  return `
    <h2>Service Booking Confirmation</h2>
    <p>Dear ${customerName},</p>
    <p>Your service booking has been confirmed!</p>
    <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <p><strong>Booking Number:</strong> ${bookingNumber}</p>
      <p><strong>Service:</strong> ${serviceName}</p>
      <p><strong>Scheduled Date:</strong> ${scheduledDate}</p>
    </div>
    <p>Our technician will visit your location at the scheduled time.</p>
    <p>If you need to reschedule, please contact us at least 24 hours before the appointment.</p>
    <p>Best regards,<br>Solar Store Team</p>
  `;
}
