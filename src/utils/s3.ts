import AWS from "aws-sdk";
import * as fs from "fs";
import * as path from "path";

const s3Client = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export function isS3Configured(): boolean {
  return Boolean(
    process.env.AWS_S3_BUCKET &&
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION,
  );
}

export async function uploadBufferToS3(
  buffer: Buffer,
  fileName: string,
  contentType?: string,
): Promise<string | null> {
  try {
    if (!isS3Configured()) {
      console.warn("AWS S3 not fully configured, skipping upload.");
      return null;
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: `uploads/${fileName}`,
      Body: buffer,
      ContentType: contentType || getContentType(fileName),
      ACL: "public-read",
    };

    const result = await s3Client.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error("S3 upload error:", error);
    return null;
  }
}

export async function uploadFileToS3(
  filePath: string,
  fileName: string,
): Promise<string | null> {
  try {
    const fileContent = fs.readFileSync(filePath);
    return uploadBufferToS3(fileContent, fileName);
  } catch (error) {
    console.error("S3 upload error:", error);
    return null;
  }
}

export async function deleteFileFromS3(fileKey: string): Promise<boolean> {
  try {
    if (!process.env.AWS_S3_BUCKET) {
      return false;
    }

    await s3Client
      .deleteObject({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileKey,
      })
      .promise();
    return true;
  } catch (error) {
    console.error("S3 delete error:", error);
    return false;
  }
}

function getContentType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  const types: { [key: string]: string } = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".pdf": "application/pdf",
  };
  return types[ext] || "application/octet-stream";
}
