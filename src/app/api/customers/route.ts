import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { APIResponse } from "@/utils/response";

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers (admin only)
 *     tags: [Customers]
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin auth
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

    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get("skip") || "0");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search");

    const filter: any = { isActive: true };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const customers = await Customer.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Customer.countDocuments(filter);

    return NextResponse.json(
      APIResponse.success(
        {
          customers,
          pagination: {
            total,
            skip,
            limit,
            pages: Math.ceil(total / limit),
          },
        },
        "Customers fetched successfully",
      ).toJSON(),
    );
  } catch (error) {
    console.error("Get customers error:", error);
    return NextResponse.json(
      APIResponse.error("Failed to fetch customers", 500, error).toJSON(),
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, phone, address, companyName, gstNumber, segment } =
      body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        APIResponse.error("Name, email, and phone are required").toJSON(),
        { status: 400 },
      );
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      address,
      companyName,
      gstNumber,
      segment: segment || "residential",
    });

    return NextResponse.json(
      APIResponse.success(
        customer,
        "Customer created successfully",
        201,
      ).toJSON(),
      { status: 201 },
    );
  } catch (error) {
    console.error("Create customer error:", error);
    return NextResponse.json(
      APIResponse.error("Failed to create customer", 500, error).toJSON(),
      { status: 500 },
    );
  }
}
