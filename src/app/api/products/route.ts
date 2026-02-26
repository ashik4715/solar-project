import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { APIResponse } from "@/utils/response";
import { can } from "@/utils/permissions";

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with pagination and filters
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: skip
 *         schema:
 *           type: number
 *           default: 0
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *   post:
 *     summary: Create a new product (admin only)
 *     tags: [Products]
 *     security:
 *       - sessionAuth: []
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("q");
    const skip = parseInt(searchParams.get("skip") || "0");
    const limit = parseInt(searchParams.get("limit") || "10");

    const filter: any = { isActive: true };
    if (category) {
      const categoryDoc =
        (await Category.findOne({ slug: category })) ||
        (await Category.findById(category).catch(() => null));
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      }
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .populate("category")
      .sort({ displayOrder: 1, createdAt: -1 });

    const total = await Product.countDocuments(filter);

    return NextResponse.json(
      APIResponse.success(
        {
          products,
          pagination: {
            total,
            skip,
            limit,
            pages: Math.ceil(total / limit),
          },
        },
        "Products fetched successfully",
      ).toJSON(),
    );
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      APIResponse.error("Failed to fetch products", 500, error).toJSON(),
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

    if (!can(sessionData.role, "products", "create")) {
      return NextResponse.json(APIResponse.forbidden().toJSON(), {
        status: 403,
      });
    }

    await connectDB();

    const body = await request.json();
    const {
      name,
      slug,
      description,
      category,
      price,
      salePrice,
      sku,
      images,
      videos,
      specifications,
      stock,
    } = body;

    // Validate required fields
    if (!name || !slug || !category || !price || !sku) {
      return NextResponse.json(
        APIResponse.error("Missing required fields").toJSON(),
        { status: 400 },
      );
    }

    const product = await Product.create({
      name,
      slug,
      description,
      category,
      price,
      salePrice: typeof salePrice === "number" ? salePrice : price,
      sku,
      images: images || [],
      videos: videos || [],
      specifications: specifications || {},
      stock: typeof stock === "number" ? stock : 0,
    });

    return NextResponse.json(
      APIResponse.success(
        product,
        "Product created successfully",
        201,
      ).toJSON(),
      { status: 201 },
    );
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      APIResponse.error("Failed to create product", 500, error).toJSON(),
      { status: 500 },
    );
  }
}
