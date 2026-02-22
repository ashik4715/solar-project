import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { APIResponse } from "@/utils/response";

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    // Check if user is authenticated
    const session = request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.json(APIResponse.unauthorized().toJSON(), {
        status: 401,
      });
    }

    // Get user ID from session (you may need to parse session to get user ID)
    // For now, we'll get the authenticated user from /api/auth/me equivalent
    const { name } = await request.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        APIResponse.error("Name is required", 400).toJSON(),
        { status: 400 },
      );
    }

    // In a real app, get the actual user ID from the session
    // This is a simplified version - you'll need to integrate with your session management
    const authResponse = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/me`,
      {
        headers: {
          cookie: `session=${session}`,
        },
      },
    );

    if (!authResponse.ok) {
      return NextResponse.json(APIResponse.unauthorized().toJSON(), {
        status: 401,
      });
    }

    const authData = await authResponse.json();
    const userId = authData.data?.user?._id || authData.data?._id;

    if (!userId) {
      return NextResponse.json(APIResponse.unauthorized().toJSON(), {
        status: 401,
      });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        APIResponse.error("User not found", 404).toJSON(),
        { status: 404 },
      );
    }

    return NextResponse.json(
      APIResponse.success(
        { user: updatedUser },
        "Profile updated successfully",
      ).toJSON(),
    );
  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      APIResponse.error("Failed to update profile", 500, error).toJSON(),
      { status: 500 },
    );
  }
}
