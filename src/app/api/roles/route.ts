import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Role from "@/models/Role";
import { APIResponse } from "@/utils/response";
import { can } from "@/utils/permissions";

export async function GET() {
  await connectDB();
  const roles = await Role.find({}).sort({ createdAt: -1 });
  return NextResponse.json(APIResponse.success(roles, "Roles fetched").toJSON());
}

export async function POST(request: NextRequest) {
  await connectDB();
  const session = request.cookies.get("session")?.value;
  if (!session)
    return NextResponse.json(APIResponse.unauthorized().toJSON(), {
      status: 401,
    });
  const roleName = JSON.parse(Buffer.from(session, "base64").toString()).role;
  if (!(await can(roleName, "roles", "create"))) {
    return NextResponse.json(APIResponse.forbidden().toJSON(), { status: 403 });
  }

  const body = await request.json();
  if (!body.name) {
    return NextResponse.json(
      APIResponse.error("Role name is required").toJSON(),
      { status: 400 },
    );
  }
  const existing = await Role.findOne({ name: body.name });
  if (existing) {
    return NextResponse.json(
      APIResponse.error("Role already exists").toJSON(),
      { status: 409 },
    );
  }

  const roleDoc = await Role.create({
    name: body.name,
    description: body.description || "",
    permissions: body.permissions || {},
  });

  return NextResponse.json(
    APIResponse.success(roleDoc, "Role created", 201).toJSON(),
    { status: 201 },
  );
}
