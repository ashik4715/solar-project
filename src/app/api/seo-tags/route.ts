import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SeoTag from "@/models/SEOTag";
import { APIResponse } from "@/utils/response";
import { can } from "@/utils/permissions";

export async function GET(request: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (path) {
    const tag = await SeoTag.findOne({ path });
    if (!tag) {
      return NextResponse.json(
        APIResponse.notFound("SEO tag not found").toJSON(),
        { status: 404 },
      );
    }
    return NextResponse.json(APIResponse.success(tag).toJSON());
  }

  const tags = await SeoTag.find({}).sort({ updatedAt: -1 });
  return NextResponse.json(APIResponse.success(tags).toJSON());
}

export async function POST(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) {
    return NextResponse.json(APIResponse.unauthorized().toJSON(), {
      status: 401,
    });
  }
  const role = JSON.parse(Buffer.from(session, "base64").toString()).role;
  if (!(await can(role, "seo", "create"))) {
    return NextResponse.json(APIResponse.forbidden().toJSON(), {
      status: 403,
    });
  }

  await connectDB();
  const body = await request.json();
  if (!body.path) {
    return NextResponse.json(
      APIResponse.error("Path is required").toJSON(),
      { status: 400 },
    );
  }
  const created = await SeoTag.create({
    path: body.path,
    metaTitle: body.metaTitle || "",
    metaDescription: body.metaDescription || "",
    metaImage: body.metaImage || "",
  });

  return NextResponse.json(
    APIResponse.success(created, "SEO tag saved", 201).toJSON(),
    { status: 201 },
  );
}
