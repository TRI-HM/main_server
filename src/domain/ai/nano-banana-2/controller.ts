/**
 * Controller cho NanoBanana2 — AI image generation.
 *
 * Luồng xử lý của endpoint POST /generate:
 *   1. Nhận ảnh upload từ client (multipart form-data field "image") + prompt
 *   2. Tạo tên file chung: {name}-{timestamp} (VD: nguyen_van_a-20260401143025123)
 *   3. Upload ảnh gốc lên cloud storage: {baseName}-original.{ext}
 *   4. Gọi Kie.ai NanoBanana2 API với URL ảnh gốc + prompt
 *   5. Download ảnh AI trả về, upload lên cloud: {baseName}-generated.{ext}
 *   6. Trả về cả 2 URL cho client
 */

import { Request, Response } from "express";
import axios from "axios";
import sharp from "sharp";
import { StatusCodes } from "http-status-codes";
import { wrapAsync } from "../../../util/wrapAsync";
import ioCustom from "../../../util/ioCustom";
import { uploadImageBufferToPublicUrl } from "../../../services/storage/cloudStorage.service";
import { generateImage, NanoBanana2Options } from "../../../services/ai/nanoBanana2.service";

/** Nén ảnh xuống kích thước mục tiêu (mặc định ~200KB) */
async function compressImage(
  buffer: Buffer,
  targetSizeKB: number = 200
): Promise<{ buffer: Buffer; mimetype: string }> {
  const targetBytes = targetSizeKB * 1024;

  // Nếu ảnh đã nhỏ hơn mục tiêu, trả về nguyên bản dạng jpeg
  if (buffer.length <= targetBytes) {
    const output = await sharp(buffer).jpeg({ quality: 90 }).toBuffer();
    return { buffer: output, mimetype: "image/jpeg" };
  }

  // Ước lượng quality dựa trên tỷ lệ kích thước
  let quality = Math.round((targetBytes / buffer.length) * 100);
  quality = Math.max(20, Math.min(quality, 85));

  let output = await sharp(buffer)
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();

  // Nếu vẫn còn lớn, giảm quality dần
  while (output.length > targetBytes && quality > 20) {
    quality -= 10;
    output = await sharp(buffer)
      .jpeg({ quality: Math.max(20, quality), mozjpeg: true })
      .toBuffer();
  }

  // Nếu vẫn còn lớn, resize nhỏ lại
  if (output.length > targetBytes) {
    const metadata = await sharp(buffer).metadata();
    const scale = Math.sqrt(targetBytes / output.length);
    const newWidth = Math.round((metadata.width || 1024) * scale);
    output = await sharp(buffer)
      .resize(newWidth)
      .jpeg({ quality: Math.max(20, quality), mozjpeg: true })
      .toBuffer();
  }

  console.log(
    `Image compressed: ${(buffer.length / 1024).toFixed(0)}KB → ${(output.length / 1024).toFixed(0)}KB (quality: ${quality})`
  );

  return { buffer: output, mimetype: "image/jpeg" };
}

/** Tạo timestamp dạng yyyyMMddHHmmssSSS */
function getTimestamp(): string {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
    String(now.getMilliseconds()).padStart(3, "0"),
  ].join("");
}

/**
 * POST /api/nano-banana-2/generate
 *
 * Body (multipart/form-data):
 *   - image: file ảnh gốc (required)
 *   - name: tên cơ sở cho file (required, VD: "nguyen_van_a")
 *   - prompt: mô tả ảnh cần tạo (required)
 *   - aspect_ratio: tỷ lệ ảnh (optional, default: "auto")
 *   - resolution: "1K" | "2K" | "4K" (optional, default: "1K")
 *   - output_format: "png" | "jpg" (optional, default: "jpg")
 */
export const generate = wrapAsync(async (req: Request, res: Response) => {
  const file = req.file;
  const { name, prompt, aspect_ratio, output_format } = req.body;

  // --- Validate input ---
  if (!file?.buffer) {
    res.status(StatusCodes.BAD_REQUEST).json(
      ioCustom.toResponseError({
        code: StatusCodes.BAD_REQUEST,
        message: 'Thiếu file ảnh. Gửi multipart field tên "image".',
      })
    );
    return;
  }

  if (!name || !prompt) {
    res.status(StatusCodes.BAD_REQUEST).json(
      ioCustom.toResponseError({
        code: StatusCodes.BAD_REQUEST,
        message: 'Thiếu "name" hoặc "prompt" trong body.',
      })
    );
    return;
  }

  const apiKey = process.env.KIE_API_KEY;
  if (!apiKey) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      ioCustom.toResponseError({
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "KIE_API_KEY chưa được cấu hình trên server.",
      })
    );
    return;
  }

  // --- Tạo tên file chung: {name}-{timestamp} ---
  const safeName = name
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "");
  console.log("Safe name:", safeName);
  const timestamp = getTimestamp();
  // const baseName = `${safeName}-${timestamp}`;
  const baseName = `${safeName}`; // Tạm thời bỏ timestamp

  const aiOutputFormat = output_format || "jpg";

  // --- Bước 1: Nén ảnh gốc rồi upload lên cloud storage ---
  const compressed = await compressImage(file.buffer, 200);
  const originalFileName = `${baseName}-original.jpg`;
  const originalUrl = await uploadImageBufferToPublicUrl(
    compressed.buffer,
    originalFileName,
    compressed.mimetype
  );

  // --- Bước 2: Gọi Kie.ai NanoBanana2 để tạo ảnh AI ---
  const options: NanoBanana2Options = {
    imageUrl: originalUrl,
    prompt,
    aspectRatio: "9:16",
    outputFormat: aiOutputFormat,
  };

  const aiTempUrl = await generateImage(apiKey, options);

  // --- Bước 3: Download ảnh AI và upload lên cloud storage ---
  console.log("Downloading AI image from:", aiTempUrl);
  const aiImageResponse = await axios.get<ArrayBuffer>(aiTempUrl, {
    responseType: "arraybuffer",
    timeout: 60000,
  });
  const aiBuffer = Buffer.from(aiImageResponse.data);

  // Nén ảnh AI xuống ~500KB trước khi upload
  const compressedAi = await compressImage(aiBuffer, 500);
  const generatedFileName = `${baseName}-generated.jpg`;
  const generatedUrl = await uploadImageBufferToPublicUrl(
    compressedAi.buffer,
    generatedFileName,
    compressedAi.mimetype
  );

  // --- Trả về kết quả ---
  res.status(StatusCodes.OK).json(
    ioCustom.toResponse(StatusCodes.OK, "Tạo ảnh AI thành công", {
      originalUrl,
      generatedUrl,
      baseName,
    })
  );
});

/** Route test để client gửi ảnh lên mà không cần generate AI và upload cloud storage, dùng ảnh mẫu có sẵn trên server */
export const generateTest = wrapAsync(async (req: Request, res: Response) => {
  const file = req.file;
  const { name, prompt } = req.body;

  if (!file?.buffer) {
    res.status(StatusCodes.BAD_REQUEST).json(
      ioCustom.toResponseError({
        code: StatusCodes.BAD_REQUEST,
        message: 'Thiếu file ảnh. Gửi multipart field tên "image".',
      })
    );
    return;
  }

  if (!name || !prompt) {
    res.status(StatusCodes.BAD_REQUEST).json(
      ioCustom.toResponseError({
        code: StatusCodes.BAD_REQUEST,
        message: 'Thiếu "name" hoặc "prompt" trong body.',
      })
    );
    return;
  }

  // Trả về URL tĩnh của ảnh mẫu trên server
  const sampleImageUrl = `${req.protocol}://${req.get("host")}/images/test/image-test.jpg`;

  setTimeout(() => {
    res.status(StatusCodes.OK).json(
      ioCustom.toResponse(StatusCodes.OK, "Test generate thành công", {
        originalUrl: sampleImageUrl,
        generatedUrl: sampleImageUrl,
        baseName: name,
      })
    );
  }, 10000);
});