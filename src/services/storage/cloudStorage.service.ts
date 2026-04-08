import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { generateFileNameWithTime } from "../../util/generateNameWithTime";

const s3 = new S3Client({
  region: "us-east-1",
  endpoint: process.env.ENDPOINT_CLOUD_STORAGE,
  credentials: {
    accessKeyId: process.env.SECRET_NAME || "",
    secretAccessKey: process.env.SECRET_KEY || "",
  },
  forcePathStyle: true,
});

const BUCKET = process.env.BUCKET_NAME || "main-server";

/**
 * Upload buffer lên ViettelIDC S3-compatible cloud storage hoặc lưu local nếu chưa cấu hình.
 */
export async function uploadImageBufferToPublicUrl(
  buffer: Buffer,
  originalFilename: string,
  mimeType: string
): Promise<string> {
  const endpoint = process.env.ENDPOINT_CLOUD_STORAGE?.trim();

  if (endpoint) {
    const safeBase = originalFilename.replace(/[^a-zA-Z0-9._-]/g, "_") || "image";
    const key = `uploads/${generateFileNameWithTime()}-${safeBase}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
        ACL: "public-read",
      })
    );

    return `${endpoint.replace(/\/$/, "")}/${BUCKET}/${key}`;
  }

  const baseUrl = process.env.BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    throw new Error("BASE_URL is required when ENDPOINT_CLOUD_STORAGE is not set");
  }

  const uploadsDir = path.join(process.cwd(), "public", "images", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const safeBase = originalFilename.replace(/[^a-zA-Z0-9._-]/g, "_") || "image";
  const filename = `${generateFileNameWithTime()}-${safeBase}`;
  const fullPath = path.join(uploadsDir, filename);
  fs.writeFileSync(fullPath, buffer);

  return `${baseUrl}/images/uploads/${filename}`;
}
