import { NextRequest, NextResponse } from "next/server";
import multer from "multer";
import * as path from "path";
import * as fs from "fs";
import { APIResponse } from "@/utils/response";
import { uploadFileToS3 } from "@/utils/s3";

const uploadDir = path.join(process.cwd(), "public/uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename);
    },
  }),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/quicktime",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

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
    // This is a simplified version - in production, use proper middleware
    return NextResponse.json(
      APIResponse.error("Please use the file upload form").toJSON(),
      { status: 400 },
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      APIResponse.error("Upload failed", 500, error).toJSON(),
      { status: 500 },
    );
  }
}
