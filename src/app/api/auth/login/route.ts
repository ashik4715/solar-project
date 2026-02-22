import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword, verifyPassword } from "@/utils/helpers";
import { APIResponse } from "@/utils/response";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        APIResponse.error("Email and password are required").toJSON(),
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json(
        APIResponse.error("Invalid email or password").toJSON(),
        { status: 401 },
      );
    }

    if (!user.isActive) {
      return NextResponse.json(APIResponse.error("User is inactive").toJSON(), {
        status: 403,
      });
    }

    // Create session
    const sessionData = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const sessionString = Buffer.from(JSON.stringify(sessionData)).toString(
      "base64",
    );

    const response = NextResponse.json(
      APIResponse.success(
        {
          user: {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
          },
        },
        "Login successful",
      ).toJSON(),
    );

    response.cookies.set("session", sessionString, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      APIResponse.error("Login failed", 500, error).toJSON(),
      { status: 500 },
    );
  }
}
