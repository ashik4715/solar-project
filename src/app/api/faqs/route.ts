import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FAQ from "@/models/FAQ";
import { APIResponse } from "@/utils/response";
import { can } from "@/utils/permissions";

export async function GET(request: NextRequest) {
  await connectDB();
  const session = request.cookies.get("session")?.value;
  let includeDrafts = false;
  if (session) {
    try {
      const role = JSON.parse(Buffer.from(session, "base64").toString()).role;
      includeDrafts = role === "admin" || role === "manager";
    } catch {
      /* ignore */
    }
  }
  const filter = includeDrafts ? {} : { isPublished: true };
  const faqs = await FAQ.find(filter).sort({ createdAt: -1 });
  return NextResponse.json(
    APIResponse.success(faqs, "FAQs fetched").toJSON(),
  );
}

export async function POST(request: NextRequest) {
  await connectDB();
  const session = request.cookies.get("session")?.value;
  if (!session) return NextResponse.json(APIResponse.unauthorized().toJSON(), { status: 401 });
  const role = JSON.parse(Buffer.from(session, "base64").toString()).role;
  if (!(await can(role, "faqs", "create"))) {
    return NextResponse.json(APIResponse.forbidden().toJSON(), { status: 403 });
  }

  const body = await request.json();
  const faq = await FAQ.create({
    ...body,
    category: body.category || "general",
    isPublished: body.isPublished ?? true,
  });
  return NextResponse.json(
    APIResponse.success(faq, "FAQ created", 201).toJSON(),
    { status: 201 },
  );
}
