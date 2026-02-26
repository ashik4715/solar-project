import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { APIResponse } from "@/utils/response";
import { can } from "@/utils/permissions";

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *   post:
 *     summary: Create a new category (admin only)
 *     tags: [Categories]
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const categories = await Category.find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .populate({
        path: "parentId",
        select: "name slug",
      });

    return NextResponse.json(
      APIResponse.success(
        categories,
        "Categories fetched successfully",
      ).toJSON(),
    );
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      APIResponse.error("Failed to fetch categories", 500, error).toJSON(),
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin auth
    const session = request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.json(APIResponse.unauthorized().toJSON(), {
        status: 401,
      });
    }

    let sessionData;
    try {
      sessionData = JSON.parse(Buffer.from(session, "base64").toString());
    } catch (e) {
      return NextResponse.json(APIResponse.unauthorized().toJSON(), {
        status: 401,
      });
    }

    if (!can(sessionData.role, "categories", "create")) {
      return NextResponse.json(APIResponse.forbidden().toJSON(), {
        status: 403,
      });
    }

    await connectDB();

    const body = await request.json();
    const { name, slug, description, image, videoUrl, parentId } = body;

    if (!name || !slug) {
      return NextResponse.json(
        APIResponse.error("Name and slug are required").toJSON(),
        { status: 400 },
      );
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      videoUrl,
      parentId: parentId || null,
    });

    return NextResponse.json(
      APIResponse.success(
        category,
        "Category created successfully",
        201,
      ).toJSON(),
      { status: 201 },
    );
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json(
      APIResponse.error("Failed to create category", 500, error).toJSON(),
      { status: 500 },
    );
  }
}
