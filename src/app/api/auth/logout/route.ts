import { NextRequest, NextResponse } from "next/server";
import { APIResponse } from "@/utils/response";

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 */
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      APIResponse.success({}, "Logout successful").toJSON(),
    );

    response.cookies.set("session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      APIResponse.error("Logout failed", 500, error).toJSON(),
      { status: 500 },
    );
  }
}
