import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { APIResponse } from "@/utils/response";

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
    const auth = await requireAdmin(request);
    if (!auth.ok) {
      const res =
        auth.status === 403
          ? APIResponse.forbidden()
          : APIResponse.unauthorized();
      return NextResponse.json(res.toJSON(), { status: auth.status });
    }

    await connectDB();
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
