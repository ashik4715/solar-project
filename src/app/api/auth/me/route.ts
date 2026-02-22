import { NextRequest, NextResponse } from "next/server";
import { APIResponse } from "@/utils/response";

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user session info
 *     tags: [Auth]
 */
export async function GET(request: NextRequest) {
  try {
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

    return NextResponse.json(
      APIResponse.success(
        {
          user: {
            id: sessionData.userId,
            email: sessionData.email,
            role: sessionData.role,
            name: sessionData.name,
          },
        },
        "Session valid",
      ).toJSON(),
    );
  } catch (error) {
    return NextResponse.json(APIResponse.unauthorized().toJSON(), {
      status: 401,
    });
  }
}
