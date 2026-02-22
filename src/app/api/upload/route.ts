import { NextRequest, NextResponse } from "next/server";
import * as path from "path";
import * as fs from "fs";
import { APIResponse } from "@/utils/response";
import { uploadBufferToS3, isS3Configured } from "@/utils/s3";

const uploadDir = path.join(process.cwd(), "public/uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload image or video file
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        APIResponse.error("File is required").toJSON(),
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const localPath = path.join(uploadDir, fileName);

    fs.writeFileSync(localPath, buffer);

    let remoteUrl: string | null = null;
    if (isS3Configured()) {
      remoteUrl = await uploadBufferToS3(
        buffer,
        fileName,
        file.type || undefined,
      );
    }

    const url = remoteUrl || `/uploads/${fileName}`;

    return NextResponse.json(
      APIResponse.success(
        { url, storedInS3: Boolean(remoteUrl) },
        remoteUrl
          ? "File uploaded to S3 successfully"
          : "File saved locally. Configure S3 to sync automatically.",
        remoteUrl ? 201 : 202,
      ).toJSON(),
      { status: remoteUrl ? 201 : 202 },
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      APIResponse.error("Upload failed", 500, error).toJSON(),
      { status: 500 },
    );
  }
}
