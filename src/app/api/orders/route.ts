import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Customer from "@/models/Customer";
import { APIResponse } from "@/utils/response";
import { generateOrderNumber } from "@/utils/helpers";
import { can } from "@/utils/permissions";

export async function GET(request: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const filter: any = {};
  if (status) filter.orderStatus = status;

  const orders = await Order.find(filter)
    .populate("customer")
    .sort({ createdAt: -1 });
  return NextResponse.json(
    APIResponse.success(orders, "Orders fetched").toJSON(),
  );
}

export async function POST(request: NextRequest) {
  await connectDB();
  const session = request.cookies.get("session")?.value;
  if (!session)
    return NextResponse.json(APIResponse.unauthorized().toJSON(), {
      status: 401,
    });
  const role = JSON.parse(Buffer.from(session, "base64").toString()).role;
  if (!(await can(role, "orders", "create"))) {
    return NextResponse.json(APIResponse.forbidden().toJSON(), { status: 403 });
  }

  const body = await request.json();
  const {
    customerId,
    items = [],
    shippingAddress,
    orderStatus = "pending",
    paymentStatus = "pending",
    notes,
  } = body;

  if (!customerId || items.length === 0) {
    return NextResponse.json(
      APIResponse.error("Customer and at least one item are required").toJSON(),
      { status: 400 },
    );
  }

  const customer = await Customer.findById(customerId);
  if (!customer) {
    return NextResponse.json(APIResponse.notFound("Customer not found").toJSON(), {
      status: 404,
    });
  }

  const subtotal = items.reduce(
    (sum: number, it: any) => sum + (it.price || 0) * (it.quantity || 1),
    0,
  );
  const tax = body.tax ?? 0;
  const totalAmount = subtotal + tax;

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    customer: customerId,
    items,
    subtotal,
    tax,
    totalAmount,
    paymentStatus,
    orderStatus,
    shippingAddress,
    notes,
  });

  return NextResponse.json(
    APIResponse.success(order, "Order created", 201).toJSON(),
    { status: 201 },
  );
}
