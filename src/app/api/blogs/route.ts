import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { APIResponse } from "@/utils/response";
import { can } from "@/utils/permissions";

export async function GET(request: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const onlyPublished = searchParams.get("published") !== "false";
  const filter: any = {};
  if (onlyPublished) filter.isPublished = true;
  const posts = await Blog.find(filter).sort({ createdAt: -1 });
  return NextResponse.json(APIResponse.success(posts, "Blogs fetched").toJSON());
}

export async function POST(request: NextRequest) {
  await connectDB();
  const session = request.cookies.get("session")?.value;
  if (!session)
    return NextResponse.json(APIResponse.unauthorized().toJSON(), {
      status: 401,
    });
  const role = JSON.parse(Buffer.from(session, "base64").toString()).role;
  if (!(await can(role, "blogs", "create"))) {
    return NextResponse.json(APIResponse.forbidden().toJSON(), { status: 403 });
  }
  const body = await request.json();
  if (!body.title || !body.slug) {
    return NextResponse.json(
      APIResponse.error("Title and slug are required").toJSON(),
      { status: 400 },
    );
  }
  const created = await Blog.create(body);
  return NextResponse.json(
    APIResponse.success(created, "Blog created", 201).toJSON(),
    { status: 201 },
  );
}
