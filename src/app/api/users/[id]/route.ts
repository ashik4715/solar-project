import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { APIResponse } from "@/utils/response";
import { can } from "@/utils/permissions";
import { hashPassword } from "@/utils/helpers";

async function authorize(request: NextRequest, action: "read" | "update" | "delete") {
  const session = request.cookies.get("session")?.value;
  if (!session) return { ok: false, status: 401 };
  const role = JSON.parse(Buffer.from(session, "base64").toString()).role;
  const allowed = await can(role, "users", action === "read" ? "read" : action);
  return allowed ? { ok: true } : { ok: false, status: 403 };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authorize(request, "update");
  if (!auth.ok) {
    const res =
      auth.status === 401
        ? APIResponse.unauthorized()
        : APIResponse.forbidden();
    return NextResponse.json(res.toJSON(), { status: auth.status });
  }

  await connectDB();
  const { id } = await params;
  const body = await request.json();

  const updates: any = {
    name: body.name,
    role: body.role,
    phone: body.phone,
    isActive: body.isActive,
  };
  if (body.password) {
    updates.password = await hashPassword(body.password);
  }

  const updated = await User.findByIdAndUpdate(id, updates, { new: true });
  if (!updated) {
    return NextResponse.json(APIResponse.notFound().toJSON(), { status: 404 });
  }

  return NextResponse.json(
    APIResponse.success(
      { id: updated._id, name: updated.name, email: updated.email, role: updated.role },
      "User updated",
    ).toJSON(),
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authorize(request, "delete");
  if (!auth.ok) {
    const res =
      auth.status === 401
        ? APIResponse.unauthorized()
        : APIResponse.forbidden();
    return NextResponse.json(res.toJSON(), { status: auth.status });
  }

  await connectDB();
  const { id } = await params;
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json(APIResponse.notFound().toJSON(), { status: 404 });
  }

  return NextResponse.json(APIResponse.success(null, "User deleted").toJSON());
}
