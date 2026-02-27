import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SeoTag from "@/models/SEOTag";
import { APIResponse } from "@/utils/response";
import { can } from "@/utils/permissions";

async function authorize(request: NextRequest, action: "update" | "delete") {
  const session = request.cookies.get("session")?.value;
  if (!session) return { ok: false, status: 401 };
  const role = JSON.parse(Buffer.from(session, "base64").toString()).role;
  const allowed = await can(role, "seo", action);
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
  const updated = await SeoTag.findByIdAndUpdate(
    id,
    {
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
      metaImage: body.metaImage,
      path: body.path,
    },
    { new: true },
  );
  if (!updated) {
    return NextResponse.json(APIResponse.notFound().toJSON(), {
      status: 404,
    });
  }
  return NextResponse.json(
    APIResponse.success(updated, "SEO tag updated").toJSON(),
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
  const deleted = await SeoTag.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json(APIResponse.notFound().toJSON(), {
      status: 404,
    });
  }
  return NextResponse.json(APIResponse.success(null, "Deleted").toJSON());
}
