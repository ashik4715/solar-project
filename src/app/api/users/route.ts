import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { APIResponse } from "@/utils/response";
import { can } from "@/utils/permissions";
import { hashPassword } from "@/utils/helpers";

export async function GET(request: NextRequest) {
  await connectDB();
  const session = request.cookies.get("session")?.value;
  if (!session)
    return NextResponse.json(APIResponse.unauthorized().toJSON(), {
      status: 401,
    });
  const role = JSON.parse(Buffer.from(session, "base64").toString()).role;
  if (!(await can(role, "users", "read"))) {
    return NextResponse.json(APIResponse.forbidden().toJSON(), { status: 403 });
  }

  const users = await User.find({}, "name email role isActive createdAt");
  return NextResponse.json(APIResponse.success(users, "Users fetched").toJSON());
}

export async function POST(request: NextRequest) {
  await connectDB();
  const session = request.cookies.get("session")?.value;
  if (!session)
    return NextResponse.json(APIResponse.unauthorized().toJSON(), {
      status: 401,
    });
  const actorRole = JSON.parse(Buffer.from(session, "base64").toString()).role;
  if (!(await can(actorRole, "users", "create"))) {
    return NextResponse.json(APIResponse.forbidden().toJSON(), { status: 403 });
  }

  const body = await request.json();
  const { name, email, password, role = "customer", phone } = body;
  if (!name || !email || !password) {
    return NextResponse.json(
      APIResponse.error("Name, email, and password are required").toJSON(),
      { status: 400 },
    );
  }
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return NextResponse.json(
      APIResponse.error("Email already exists").toJSON(),
      { status: 409 },
    );
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: await hashPassword(password),
    role,
    phone,
    isActive: true,
  });

  return NextResponse.json(
    APIResponse.success(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      "User created",
      201,
    ).toJSON(),
    { status: 201 },
  );
}
