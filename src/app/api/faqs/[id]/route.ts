import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FAQ from "@/models/FAQ";
import { APIResponse } from "@/utils/response";
import { can } from "@/utils/permissions";

async function authorize(request: NextRequest, action: "update" | "delete") {
  const session = request.cookies.get("session")?.value;
  if (!session) return { ok: false, status: 401 };
  const role = JSON.parse(Buffer.from(session, "base64").toString()).role;
  if (
    !(await can(role, "faqs", action === "update" ? "update" : "delete"))
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
  const faq = await FAQ.findByIdAndUpdate(id, updates, { new: true });
  if (!faq) {
    return NextResponse.json(APIResponse.notFound().toJSON(), { status: 404 });
  }
  return NextResponse.json(
    APIResponse.success(faq, "FAQ updated").toJSON(),
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
  const deleted = await FAQ.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json(APIResponse.notFound().toJSON(), { status: 404 });
  }
  return NextResponse.json(
    APIResponse.success(null, "FAQ deleted").toJSON(),
  );
}
