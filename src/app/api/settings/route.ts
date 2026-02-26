import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SiteSetting from "@/models/SiteSetting";
import { APIResponse } from "@/utils/response";
import { can } from "@/utils/permissions";

export async function GET() {
  await connectDB();
  const doc = await SiteSetting.findOne({});
  return NextResponse.json(
    APIResponse.success(doc, "Settings fetched").toJSON(),
  );
}

export async function PUT(request: NextRequest) {
  await connectDB();
  const session = request.cookies.get("session")?.value;
  if (!session)
    return NextResponse.json(APIResponse.unauthorized().toJSON(), {
      status: 401,
    });
  const role = JSON.parse(Buffer.from(session, "base64").toString()).role;
  if (!(await can(role, "settings", "update"))) {
    return NextResponse.json(APIResponse.forbidden().toJSON(), {
      status: 403,
    });
  }

  const body = await request.json();
  const updated = await SiteSetting.findOneAndUpdate({}, body, {
    upsert: true,
    new: true,
  });
  return NextResponse.json(
    APIResponse.success(updated, "Settings saved").toJSON(),
  );
}
