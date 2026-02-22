import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Customer from "@/models/Customer";
import { hashPassword } from "@/utils/helpers";
import { APIResponse } from "@/utils/response";

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new customer account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 */
export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        APIResponse.error("Name, email, and password are required").toJSON(),
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        APIResponse.error("Password must be at least 6 characters").toJSON(),
        { status: 400 },
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        APIResponse.error("Email already registered").toJSON(),
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      role: "customer",
      isActive: true,
    });

    await user.save();

    // Also create a Customer record
    try {
      const customer = new Customer({
        name,
        email: email.toLowerCase(),
        phone: phone || "",
        segment: "residential",
        isActive: true,
      });
      await customer.save();
    } catch (customerError) {
      // Customer creation error is not critical, log but continue
      console.warn("Warning: Customer record creation failed:", customerError);
    }

    return NextResponse.json(
      APIResponse.success(
        {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
          },
        },
        "User registered successfully",
      ).toJSON(),
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      APIResponse.error("Registration failed: " + error.message).toJSON(),
      { status: 500 },
    );
  }
}
