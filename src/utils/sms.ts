import { Twilio } from "twilio";

const twilioClient = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

export async function sendSMS(
  phoneNumber: string,
  message: string,
): Promise<boolean> {
  try {
    if (!process.env.TWILIO_PHONE_NUMBER) {
      console.warn("TWILIO_PHONE_NUMBER not configured");
      return false;
    }

    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    return true;
  } catch (error) {
    console.error("SMS sending error:", error);
    return false;
  }
}

export function getOrderConfirmationSMS(orderNumber: string): string {
  return `Your order ${orderNumber} has been confirmed. You will receive further updates via email. Thank you for shopping with Solar Store!`;
}

export function getQuoteApprovedSMS(): string {
  return `Your quote has been approved. Next steps will be communicated to you shortly. Thank you for choosing Solar Store!`;
}
