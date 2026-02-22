import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { APIResponse } from "@/utils/response";
import { isS3Configured, uploadBufferToS3 } from "@/utils/s3";

export async function POST(request: NextRequest) {
  try {
    if (!isS3Configured()) {
      return NextResponse.json(
        APIResponse.error(
          "AWS S3 is not configured. Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, and AWS_S3_BUCKET.",
          400,
        ).toJSON(),
        { status: 400 },
      );
    }

    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      return NextResponse.json(
        APIResponse.error("No local uploads directory to sync").toJSON(),
        { status: 404 },
      );
    }

    const files = fs.readdirSync(uploadDir);
    if (files.length === 0) {
      return NextResponse.json(
        APIResponse.success(
          { uploaded: [], skipped: [] },
          "No files to sync",
          200,
        ).toJSON(),
      );
    }

    const uploaded: { file: string; url: string | null }[] = [];
    for (const file of files) {
      const buffer = fs.readFileSync(path.join(uploadDir, file));
      const url = await uploadBufferToS3(buffer, file);
      uploaded.push({ file, url });
    }

    return NextResponse.json(
      APIResponse.success(
        { uploaded },
        "Sync completed",
      ).toJSON(),
    );
  } catch (error) {
    console.error("Media sync error:", error);
    return NextResponse.json(
      APIResponse.error("Failed to sync media", 500, error).toJSON(),
      { status: 500 },
    );
  }
}
