import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { APIResponse } from "@/utils/response";
import { can } from "@/utils/permissions";

async function authorize(request: NextRequest, action: "read" | "update" | "delete") {
  const session = request.cookies.get("session")?.value;
  if (!session) return { ok: false, status: 401 };
  const role = JSON.parse(Buffer.from(session, "base64").toString()).role;
  const allowed = await can(role, "blogs", action === "read" ? "read" : action);
  return allowed ? { ok: true } : { ok: false, status: 403 };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  const post = await Blog.findById(id);
  if (!post) return NextResponse.json(APIResponse.notFound().toJSON(), { status: 404 });
  if (!post.isPublished) {
    const auth = await authorize(request, "read");
    if (!auth.ok) {
      return NextResponse.json(APIResponse.forbidden().toJSON(), { status: 403 });
    }
  }
  return NextResponse.json(APIResponse.success(post).toJSON());
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
  const updated = await Blog.findByIdAndUpdate(id, body, { new: true });
  if (!updated) {
    return NextResponse.json(APIResponse.notFound().toJSON(), { status: 404 });
  }
  return NextResponse.json(APIResponse.success(updated, "Blog updated").toJSON());
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
  const deleted = await Blog.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json(APIResponse.notFound().toJSON(), { status: 404 });
  }
  return NextResponse.json(APIResponse.success(null, "Blog deleted").toJSON());
}
