import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Quote from "@/models/Quote";
import { generateQuoteNumber, calculateTax } from "@/utils/helpers";
import { sendEmail, getQuoteEmailTemplate } from "@/utils/email";
import { APIResponse } from "@/utils/response";

/**
 * @swagger
 * /api/quotes:
 *   get:
 *     summary: Get quotes (admin) or customer's quotes
 *     tags: [Quotes]
 *   post:
 *     summary: Create a new quote
 *     tags: [Quotes]
 */
export async function GET(request: NextRequest) {
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

    await connectDB();

    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get("skip") || "0");
    const limit = parseInt(searchParams.get("limit") || "20");

    let filter: any = {};
    if (sessionData.role !== "admin") {
      filter.customer = sessionData.userId;
    }

    const quotes = await Quote.find(filter)
      .skip(skip)
      .limit(limit)
      .populate("customer")
      .populate("items.product")
      .sort({ createdAt: -1 });

    const total = await Quote.countDocuments(filter);

    return NextResponse.json(
      APIResponse.success(
        {
          quotes,
          pagination: {
            total,
            skip,
            limit,
            pages: Math.ceil(total / limit),
          },
        },
        "Quotes fetched successfully",
      ).toJSON(),
    );
  } catch (error) {
    console.error("Get quotes error:", error);
    return NextResponse.json(
      APIResponse.error("Failed to fetch quotes", 500, error).toJSON(),
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { customerId, items } = body;

    if (!customerId || !items || items.length === 0) {
      return NextResponse.json(
        APIResponse.error("Customer ID and items are required").toJSON(),
        { status: 400 },
      );
    }

    // Calculate totals
    let subtotal = 0;
    items.forEach((item: any) => {
      subtotal += item.price * item.quantity;
    });

    const tax = calculateTax(subtotal);
    const totalAmount = subtotal + tax;

    const quote = await Quote.create({
      quoteNumber: generateQuoteNumber(),
      customer: customerId,
      items,
      subtotal,
      tax,
      totalAmount,
      status: "draft",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    return NextResponse.json(
      APIResponse.success(quote, "Quote created successfully", 201).toJSON(),
      { status: 201 },
    );
  } catch (error) {
    console.error("Create quote error:", error);
    return NextResponse.json(
      APIResponse.error("Failed to create quote", 500, error).toJSON(),
      { status: 500 },
    );
  }
}
