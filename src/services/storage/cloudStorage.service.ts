import fs from "fs";
import path from "path";
import { generateFileNameWithTime } from "../../util/generateNameWithTime";

/**
 * Upload buffer lên cloud (nếu cấu hình CLOUD_STORAGE_UPLOAD_URL) hoặc lưu local + trả URL công khai.
 *
 * CLOUD_STORAGE_UPLOAD_URL: POST multipart, field mặc định `file` (đổi bằng CLOUD_STORAGE_FILE_FIELD).
 * Response JSON cần có `url` hoặc `data.url` (tuỳ backend).
 * CLOUD_STORAGE_AUTH_HEADER: ví dụ `Bearer xxx` gửi kèm Authorization.
 */
export async function uploadImageBufferToPublicUrl(
  buffer: Buffer,
  originalFilename: string,
  mimeType: string
): Promise<string> {
  const endpoint = process.env.CLOUD_STORAGE_UPLOAD_URL?.trim();

  if (endpoint) {
    const field = process.env.CLOUD_STORAGE_FILE_FIELD || "file";
    const form = new FormData();
    form.append(field, new Blob([buffer], { type: mimeType }), originalFilename);

    const headers: Record<string, string> = {};
    const auth = process.env.CLOUD_STORAGE_AUTH_HEADER?.trim();
    if (auth) {
      headers.Authorization = auth;
    }

    const res = await fetch(endpoint, {
      method: "POST",
      body: form,
      headers,
    });

    const text = await res.text();
    if (!res.ok) {
      throw new Error(`Cloud upload failed: ${res.status} ${text}`);
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text) as Record<string, unknown>;
    } catch {
      throw new Error("Cloud upload response is not JSON");
    }

    const obj = parsed as Record<string, unknown>;
    const url =
      (typeof obj.url === "string" && obj.url) ||
      (typeof obj.data === "object" &&
        obj.data !== null &&
        typeof (obj.data as Record<string, unknown>).url === "string" &&
        (obj.data as Record<string, unknown>).url) ||
      (typeof obj.fileUrl === "string" && obj.fileUrl);

    if (typeof url !== "string" || !url) {
      throw new Error("Cloud upload response missing url");
    }
    return url;
  }

  const baseUrl = process.env.BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    throw new Error("BASE_URL is required when CLOUD_STORAGE_UPLOAD_URL is not set");
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
