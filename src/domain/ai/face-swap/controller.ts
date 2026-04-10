/**
 * Controller cho Face Swap — AI hoán đổi khuôn mặt từ ảnh user sang target_face.
 *
 * Luồng xử lý của endpoint POST /generate:
 *   1. Nhận ảnh upload từ client (multipart form-data field "image") + name + target_face URL
 *   2. Nén ảnh user rồi upload lên cloud storage: {baseName}-original.jpg
 *   3. Gọi Facemint.io Face Swap API với media_url = ảnh user, to_face = target_face URL
 *   4. Download ảnh kết quả, nén rồi upload lên cloud storage: {baseName}-generated.jpg
 *   5. Trả về 2 URL cho client (KHÔNG lưu target_face — client tự quản lý)
 */

import { Request, Response } from "express";
import axios from "axios";
import sharp from "sharp";
import { StatusCodes } from "http-status-codes";
import { wrapAsync } from "../../../util/wrapAsync";
import ioCustom from "../../../util/ioCustom";
import { uploadImageBufferToPublicUrl } from "../../../services/storage/cloudStorage.service";
import { faceSwap, FaceSwapOptions } from "../../../services/ai/faceSwap.service";

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

  // Ước lượng quality dựa trên tỷ lệ kích thước (bù hệ số phi tuyến)
  let quality = Math.round((targetBytes / buffer.length) * 100 * 1.8);
  quality = Math.max(20, Math.min(quality, 92));

  let output = await sharp(buffer)
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();

  // Nếu vẫn còn lớn, giảm quality dần
  while (output.length > targetBytes && quality > 20) {
    quality -= 5;
    output = await sharp(buffer)
      .jpeg({ quality: Math.max(20, quality), mozjpeg: true })
      .toBuffer();
  }

  // Nếu quá nhỏ so với mục tiêu, tăng quality dần để tận dụng dung lượng
  while (output.length < targetBytes * 0.7 && quality < 92) {
    quality += 5;
    output = await sharp(buffer)
      .jpeg({ quality: Math.min(92, quality), mozjpeg: true })
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

/**
 * POST /api/ai/face-swap/generate
 *
 * Body (multipart/form-data):
 *   - image: file ảnh user (required) — khuôn mặt user sẽ được ghép vào target
 *   - name: tên cơ sở cho file (required, VD: "nguyen_van_a")
 *   - target_face: URL public của ảnh target (required) — ảnh gốc giữ nội dung, chỉ thay mặt; KHÔNG lưu lên cloud của server
 *   - ref_face: URL public ảnh crop khuôn mặt trong target (optional) — dùng để
 *               xác định chính xác mặt nào cần thay khi target có nhiều người.
 *               Nếu omit, tất cả khuôn mặt trong target sẽ bị thay.
 *   - resolution: số 1-6 tương ứng 480p..8K (optional, default: 3 = 1080p)
 *   - enhance: 0 | 1 bật/tắt enhance khuôn mặt (optional, default: 1)
 */
export const generate = wrapAsync(async (req: Request, res: Response) => {
  const file = req.file;
  const { name, target_face, ref_face, resolution, enhance } = req.body;

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

  if (!name || !target_face) {
    res.status(StatusCodes.BAD_REQUEST).json(
      ioCustom.toResponseError({
        code: StatusCodes.BAD_REQUEST,
        message: 'Thiếu "name" hoặc "target_face" trong body.',
      })
    );
    return;
  }

  const apiKey = process.env.FACEMINT_API_KEY;
  if (!apiKey) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      ioCustom.toResponseError({
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "FACEMINT_API_KEY chưa được cấu hình trên server.",
      })
    );
    return;
  }

  // --- Chuẩn hoá tên file ---
  const safeName = name
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "");
  console.log("Safe name:", safeName);
  const baseName = `${safeName}`;

  // --- Bước 1: Nén ảnh user rồi upload lên cloud storage ---
  const compressed = await compressImage(file.buffer, 200);
  const originalFileName = `${baseName}-original.jpg`;
  const originalUrl = await uploadImageBufferToPublicUrl(
    compressed.buffer,
    originalFileName,
    compressed.mimetype
  );

  // --- Bước 2: Gọi Facemint.io để thực hiện face swap ---
  const options: FaceSwapOptions = {
    userImageUrl: originalUrl,
    targetImageUrl: target_face,
    type: "image",
    resolution: resolution ? Number(resolution) : undefined,
    enhance: enhance !== undefined ? Number(enhance) : undefined,
  };
  if (ref_face) {
    options.refFaceUrl = ref_face;
  }

  const aiTempUrl = await faceSwap(apiKey, options);

  // --- Bước 3: Download ảnh kết quả và upload lên cloud storage ---
  console.log("Downloading face swap result from:", aiTempUrl);
  const aiImageResponse = await axios.get<ArrayBuffer>(aiTempUrl, {
    responseType: "arraybuffer",
    timeout: 60000,
  });
  const aiBuffer = Buffer.from(aiImageResponse.data);

  // Nén ảnh kết quả xuống ~500KB trước khi upload
  const compressedAi = await compressImage(aiBuffer, 500);
  const generatedFileName = `${baseName}-generated.jpg`;
  const generatedUrl = await uploadImageBufferToPublicUrl(
    compressedAi.buffer,
    generatedFileName,
    compressedAi.mimetype
  );

  // --- Trả về kết quả (target_face KHÔNG được lưu) ---
  res.status(StatusCodes.OK).json(
    ioCustom.toResponse(StatusCodes.OK, "Face swap thành công", {
      originalUrl,
      generatedUrl,
      baseName,
    })
  );
});
