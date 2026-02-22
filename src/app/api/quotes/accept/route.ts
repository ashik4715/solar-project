import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Quote from "@/models/Quote";
import Order from "@/models/Order";
import { generateOrderNumber } from "@/utils/helpers";
import { APIResponse } from "@/utils/response";

/**
 * @swagger
 * /api/quotes/accept:
 *   post:
 *     summary: Accept a quote and create an order
 *     tags: [Quotes]
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { quoteId } = await request.json();

    const quote = await Quote.findById(quoteId);

    if (!quote) {
      return NextResponse.json(
        APIResponse.notFound("Quote not found").toJSON(),
        { status: 404 },
      );
    }

    // Create order from quote
    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customer: quote.customer,
      quote: quote._id,
      items: quote.items,
      subtotal: quote.subtotal,
      tax: quote.tax,
      totalAmount: quote.totalAmount,
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    // Update quote status
    quote.status = "accepted";
    quote.acceptedAt = new Date();
    await quote.save();

    return NextResponse.json(
      APIResponse.success(
        order,
        "Quote accepted and order created",
        201,
      ).toJSON(),
      { status: 201 },
    );
  } catch (error) {
    console.error("Accept quote error:", error);
    return NextResponse.json(
      APIResponse.error("Failed to accept quote", 500, error).toJSON(),
      { status: 500 },
    );
  }
}
