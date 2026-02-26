import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Invoice from "@/models/Invoice";
import { APIResponse } from "@/utils/response";
import { can } from "@/utils/permissions";

async function authorize(request: NextRequest, action: "update" | "delete") {
  const session = request.cookies.get("session")?.value;
  if (!session) return { ok: false, status: 401 };
  const role = JSON.parse(Buffer.from(session, "base64").toString()).role;
  const allowed = action === "update" ? "update" : "delete";
  if (!can(role, "orders", allowed)) return { ok: false, status: 403 };
  return { ok: true };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const auth = await authorize(request, "update");
  if (!auth.ok) {
    const res =
      auth.status === 403
        ? APIResponse.forbidden()
        : APIResponse.unauthorized();
    return NextResponse.json(res.toJSON(), { status: auth.status });
  }

  await connectDB();
  const updates = await request.json();
  const order = await Order.findByIdAndUpdate(id, updates, { new: true });
  if (!order) {
    return NextResponse.json(APIResponse.notFound().toJSON(), { status: 404 });
  }
  return NextResponse.json(
    APIResponse.success(order, "Order updated").toJSON(),
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const auth = await authorize(request, "delete");
  if (!auth.ok) {
    const res =
      auth.status === 403
        ? APIResponse.forbidden()
        : APIResponse.unauthorized();
    return NextResponse.json(res.toJSON(), { status: auth.status });
  }

  await connectDB();
  await Invoice.deleteMany({ order: id });
  const deleted = await Order.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json(APIResponse.notFound().toJSON(), { status: 404 });
  }
  return NextResponse.json(
    APIResponse.success(null, "Order deleted").toJSON(),
  );
}
