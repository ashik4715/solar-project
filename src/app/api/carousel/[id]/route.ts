import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CarouselItem from "@/models/CarouselItem";
import { APIResponse } from "@/utils/response";
import { can } from "@/utils/permissions";

async function authorize(request: NextRequest, action: "update" | "delete") {
  const session = request.cookies.get("session")?.value;
  if (!session) return { ok: false, status: 401 };
  const role = JSON.parse(Buffer.from(session, "base64").toString()).role;
  if (
    !(await can(role, "carousel", action === "update" ? "update" : "delete"))
  ) {
    return { ok: false, status: 403 };
  }
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
  const item = await CarouselItem.findByIdAndUpdate(id, updates, { new: true });
  if (!item) {
    return NextResponse.json(APIResponse.notFound().toJSON(), { status: 404 });
  }
  return NextResponse.json(
    APIResponse.success(item, "Carousel updated").toJSON(),
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
  const deleted = await CarouselItem.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json(APIResponse.notFound().toJSON(), { status: 404 });
  }
  return NextResponse.json(
    APIResponse.success(null, "Carousel deleted").toJSON(),
  );
}
