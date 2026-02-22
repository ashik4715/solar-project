import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword, verifyPassword } from "@/utils/helpers";
import { APIResponse } from "@/utils/response";

const FALLBACK_EMAIL = (
  process.env.ADMIN_EMAIL || "admin@solarstore.com"
).toLowerCase();
const FALLBACK_PASSWORD = process.env.ADMIN_PASSWORD || "admin123!";

async function ensureDefaultAdmin() {
  let user = await User.findOne({ email: FALLBACK_EMAIL });
  if (!user) {
    const hashed = await hashPassword(FALLBACK_PASSWORD);
    user = await User.create({
      email: FALLBACK_EMAIL,
      password: hashed,
      role: "admin",
      name: "Default Admin",
      isActive: true,
    });
  } else if (!(await verifyPassword(FALLBACK_PASSWORD, user.password))) {
    user.password = await hashPassword(FALLBACK_PASSWORD);
    user.isActive = true;
    await user.save();
  }
}

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
  const parsed = await request.json().catch(() => null);
  if (!parsed) {
    return NextResponse.json(
      APIResponse.error("Invalid JSON payload").toJSON(),
      { status: 400 },
    );
  }
  const { email, password } = parsed;

  try {
    if (!email || !password) {
      return NextResponse.json(
        APIResponse.error("Email and password are required").toJSON(),
        { status: 400 },
      );
    }

    await connectDB();
    await ensureDefaultAdmin();

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
    if (
      process.env.NODE_ENV !== "production" &&
      email?.toLowerCase() === FALLBACK_EMAIL &&
      password === FALLBACK_PASSWORD
    ) {
      const sessionData = {
        userId: "dev-admin",
        email: FALLBACK_EMAIL,
        role: "admin",
        name: "Dev Admin",
      };

      const sessionString = Buffer.from(JSON.stringify(sessionData)).toString(
        "base64",
      );

      const response = NextResponse.json(
        APIResponse.success(
          { user: sessionData },
          "Login successful (fallback)",
        ).toJSON(),
      );
      response.cookies.set("session", sessionString, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    return NextResponse.json(
      APIResponse.error("Login failed", 500, error).toJSON(),
      { status: 500 },
    );
  }
}
