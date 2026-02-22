import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Quote from "@/models/Quote";
import Customer from "@/models/Customer";
import { sendEmail, getQuoteEmailTemplate } from "@/utils/email";
import { APIResponse } from "@/utils/response";

/**
 * @swagger
 * /api/quotes/send:
 *   post:
 *     summary: Send quote to customer via email
 *     tags: [Quotes]
 */
export async function POST(request: NextRequest) {
  try {
    const session = request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.json(APIResponse.unauthorized().toJSON(), {
        status: 401,
      });
    }

    let sessionData;
    try {
      sessionData = JSON.parse(Buffer.from(session, "base64").toString());
    } catch (e) {
      return NextResponse.json(APIResponse.unauthorized().toJSON(), {
        status: 401,
      });
    }

    if (sessionData.role !== "admin") {
      return NextResponse.json(APIResponse.forbidden().toJSON(), {
        status: 403,
      });
    }

    await connectDB();

    const { quoteId } = await request.json();

    const quote = await Quote.findById(quoteId).populate("customer");

    if (!quote) {
      return NextResponse.json(
        APIResponse.notFound("Quote not found").toJSON(),
        { status: 404 },
      );
    }

    const customer = quote.customer as any;
    const quoteLink = `${process.env.NEXT_PUBLIC_API_URL}/quotes/${quote._id}`;
    const emailContent = getQuoteEmailTemplate(
      customer.name,
      quote.quoteNumber,
      quote.totalAmount,
      quote.validUntil?.toLocaleDateString() || "N/A",
      quoteLink,
    );

    const emailSent = await sendEmail({
      to: customer.email,
      subject: `Your Solar Quote #${quote.quoteNumber}`,
      html: emailContent,
    });

    if (emailSent) {
      quote.status = "sent";
      quote.sentAt = new Date();
      await quote.save();
    }

    return NextResponse.json(
      APIResponse.success(
        { quote, emailSent },
        emailSent ? "Quote sent to customer" : "Quote updated but email failed",
      ).toJSON(),
    );
  } catch (error) {
    console.error("Send quote error:", error);
    return NextResponse.json(
      APIResponse.error("Failed to send quote", 500, error).toJSON(),
      { status: 500 },
    );
  }
}
