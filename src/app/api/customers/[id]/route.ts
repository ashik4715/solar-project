import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { APIResponse } from "@/utils/response";
import { can } from "@/utils/permissions";

async function requireAdmin(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return { ok: false, status: 401 };
  try {
    const sessionData = JSON.parse(Buffer.from(session, "base64").toString());
    if (sessionData.role !== "admin") return { ok: false, status: 403 };
    return { ok: true };
  } catch (_e) {
    return { ok: false, status: 401 };
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const auth = await requireAdmin(request);
    if (!auth.ok) {
      const res =
        auth.status === 403
          ? APIResponse.forbidden()
          : APIResponse.unauthorized();
      return NextResponse.json(res.toJSON(), { status: auth.status });
    }

    await connectDB();
    const role = JSON.parse(
      Buffer.from(request.cookies.get("session")!.value, "base64").toString(),
    ).role;
    if (!can(role, "customers", "update")) {
      return NextResponse.json(APIResponse.forbidden().toJSON(), {
        status: 403,
      });
    }
    const updates = await request.json();
    const customer = await Customer.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!customer) {
      return NextResponse.json(APIResponse.notFound().toJSON(), {
        status: 404,
      });
    }

    return NextResponse.json(
      APIResponse.success(
        customer,
        "Customer updated successfully",
      ).toJSON(),
    );
  } catch (error) {
    console.error("Update customer error:", error);
    return NextResponse.json(
      APIResponse.error("Failed to update customer", 500, error).toJSON(),
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const auth = await requireAdmin(request);
    if (!auth.ok) {
      const res =
        auth.status === 403
          ? APIResponse.forbidden()
          : APIResponse.unauthorized();
      return NextResponse.json(res.toJSON(), { status: auth.status });
    }

    await connectDB();
    const role = JSON.parse(
      Buffer.from(request.cookies.get("session")!.value, "base64").toString(),
    ).role;
    if (!can(role, "customers", "delete")) {
      return NextResponse.json(APIResponse.forbidden().toJSON(), {
        status: 403,
      });
    }
    const deleted = await Customer.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(APIResponse.notFound().toJSON(), {
        status: 404,
      });
    }

    return NextResponse.json(
      APIResponse.success(
        null,
        "Customer deleted successfully",
      ).toJSON(),
    );
  } catch (error) {
    console.error("Delete customer error:", error);
    return NextResponse.json(
      APIResponse.error("Failed to delete customer", 500, error).toJSON(),
      { status: 500 },
    );
  }
}
