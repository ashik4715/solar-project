import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { APIResponse } from "@/utils/response";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Check if user is authenticated
    const session = request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.json(APIResponse.unauthorized().toJSON(), {
        status: 401,
      });
    }

    const { currentPassword, newPassword, confirmPassword } =
      await request.json();

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        APIResponse.error("All password fields are required", 400).toJSON(),
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        APIResponse.error(
          "New password must be at least 6 characters",
          400,
        ).toJSON(),
        { status: 400 },
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        APIResponse.error(
          "New password and confirmation do not match",
          400,
        ).toJSON(),
        { status: 400 },
      );
    }

    // Get authenticated user (simplified - you'll need proper session handling)
    // For now, we'll try to get from session
    let userId: string | null = null;

    // Try to extract user ID from session cookie or make auth call
    try {
      const authUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/me`;
      const authResponse = await fetch(authUrl, {
        headers: {
          cookie: `session=${session}`,
        },
      });

      if (authResponse.ok) {
        const authData = await authResponse.json();
        userId = authData.data?.user?._id || authData.data?._id;
      }
    } catch (e) {
      console.error("Failed to get user from auth:", e);
    }

    if (!userId) {
      return NextResponse.json(APIResponse.unauthorized().toJSON(), {
        status: 401,
      });
    }

    // Find user and verify current password
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        APIResponse.error("User not found", 404).toJSON(),
        { status: 404 },
      );
    }

    // Verify current password
    const isPasswordValid = await bcryptjs.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        APIResponse.error("Current password is incorrect", 400).toJSON(),
        { status: 400 },
      );
    }

    // Hash new password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json(
      APIResponse.success(
        { message: "Password changed successfully" },
        "Please login again with your new password",
      ).toJSON(),
    );
  } catch (error: any) {
    console.error("Change password error:", error);
    return NextResponse.json(
      APIResponse.error("Failed to change password", 500, error).toJSON(),
      { status: 500 },
    );
  }
}
