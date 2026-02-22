import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ContactSubmission from "@/models/ContactSubmission";
import { sendEmail } from "@/utils/email";
import { APIResponse } from "@/utils/response";

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit a contact form
 *     tags: [Contact]
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, phone, message, submissionType } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        APIResponse.error("Name, email, and message are required").toJSON(),
        { status: 400 },
      );
    }

    const submission = await ContactSubmission.create({
      name,
      email,
      phone,
      message,
      submissionType: submissionType || "inquiry",
      status: "new",
    });

    // Send confirmation email to customer
    await sendEmail({
      to: email,
      subject: "We received your message",
      html: `
        <h2>Thank you for contacting us!</h2>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>Best regards,<br>Solar Store Team</p>
      `,
    });

    // Send notification to admin
    if (process.env.SMTP_FROM_EMAIL) {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || process.env.SMTP_FROM_EMAIL,
        subject: `New Contact Submission: ${submissionType}`,
        html: `
          <h2>New Contact Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Type:</strong> ${submissionType}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      });
    }

    return NextResponse.json(
      APIResponse.success(
        submission,
        "Your message has been sent successfully",
        201,
      ).toJSON(),
      { status: 201 },
    );
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      APIResponse.error("Failed to submit contact form", 500, error).toJSON(),
      { status: 500 },
    );
  }
}
