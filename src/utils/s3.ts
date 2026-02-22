import AWS from "aws-sdk";
import * as fs from "fs";
import * as path from "path";

const s3Client = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function uploadFileToS3(
  filePath: string,
  fileName: string,
): Promise<string | null> {
  try {
    if (!process.env.AWS_S3_BUCKET) {
      console.warn("AWS_S3_BUCKET not configured, skipping S3 upload");
      return null;
    }

    const fileContent = fs.readFileSync(filePath);

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `uploads/${fileName}`,
      Body: fileContent,
      ContentType: getContentType(fileName),
    };

    const result = await s3Client.upload(params).promise();
    return result.Location;
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
