import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CarouselItem from "@/models/CarouselItem";
import { APIResponse } from "@/utils/response";
import { can } from "@/utils/permissions";

export async function GET() {
  await connectDB();
  const items = await CarouselItem.find({ isActive: true }).sort({
    order: 1,
    createdAt: -1,
  });
  return NextResponse.json(
    APIResponse.success(items, "Carousel fetched").toJSON(),
  );
}

export async function POST(request: NextRequest) {
  await connectDB();
  const session = request.cookies.get("session")?.value;
  if (!session) return NextResponse.json(APIResponse.unauthorized().toJSON(), { status: 401 });
  const role = JSON.parse(Buffer.from(session, "base64").toString()).role;
  if (!can(role, "carousel", "create")) {
    return NextResponse.json(APIResponse.forbidden().toJSON(), { status: 403 });
  }

  const body = await request.json();
  const item = await CarouselItem.create(body);
  return NextResponse.json(
    APIResponse.success(item, "Carousel item created", 201).toJSON(),
    { status: 201 },
  );
}
