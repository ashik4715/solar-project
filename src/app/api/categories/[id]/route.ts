import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
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
    if (!(await can(auth.role, "categories", "update"))) {
      return NextResponse.json(APIResponse.forbidden().toJSON(), {
        status: 403,
      });
    }
    const updates = await request.json();
    const category = await Category.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!category) {
      return NextResponse.json(APIResponse.notFound().toJSON(), {
        status: 404,
      });
    }

    return NextResponse.json(
      APIResponse.success(
        category,
        "Category updated successfully",
      ).toJSON(),
    );
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json(
      APIResponse.error("Failed to update category", 500, error).toJSON(),
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
    if (!(await can(auth.role, "categories", "delete"))) {
      return NextResponse.json(APIResponse.forbidden().toJSON(), {
        status: 403,
      });
    }
    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(APIResponse.notFound().toJSON(), {
        status: 404,
      });
    }

    return NextResponse.json(
      APIResponse.success(
        null,
        "Category deleted successfully",
      ).toJSON(),
    );
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      APIResponse.error("Failed to delete category", 500, error).toJSON(),
      { status: 500 },
    );
  }
}
