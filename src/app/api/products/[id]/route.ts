import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { APIResponse } from "@/utils/response";
import { can } from "@/utils/permissions";

async function requireAuth(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return { ok: false, status: 401 };
  try {
    const sessionData = JSON.parse(Buffer.from(session, "base64").toString());
    return { ok: true, role: sessionData.role };
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
    const auth = await requireAuth(request);
    if (!auth.ok) {
      const res =
        auth.status === 401
          ? APIResponse.unauthorized()
          : APIResponse.forbidden();
      return NextResponse.json(res.toJSON(), { status: auth.status });
    }

    await connectDB();
    if (!(await can(auth.role, "products", "update"))) {
      return NextResponse.json(APIResponse.forbidden().toJSON(), {
        status: 403,
      });
    }
    const updates = await request.json();
    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
    }).populate("category");

    if (!product) {
      return NextResponse.json(APIResponse.notFound().toJSON(), {
        status: 404,
      });
    }

    return NextResponse.json(
      APIResponse.success(
        product,
        "Product updated successfully",
      ).toJSON(),
    );
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      APIResponse.error("Failed to update product", 500, error).toJSON(),
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
    const auth = await requireAuth(request);
    if (!auth.ok) {
      const res =
        auth.status === 401
          ? APIResponse.unauthorized()
          : APIResponse.forbidden();
      return NextResponse.json(res.toJSON(), { status: auth.status });
    }

    await connectDB();
    if (!(await can(auth.role, "products", "delete"))) {
      return NextResponse.json(APIResponse.forbidden().toJSON(), {
        status: 403,
      });
    }
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(APIResponse.notFound().toJSON(), {
        status: 404,
      });
    }

    return NextResponse.json(
      APIResponse.success(
        null,
        "Product deleted successfully",
      ).toJSON(),
    );
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      APIResponse.error("Failed to delete product", 500, error).toJSON(),
      { status: 500 },
    );
  }
}
