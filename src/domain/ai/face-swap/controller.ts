/**
 * Controller cho Face Swap (async flow) — AI hoán đổi khuôn mặt.
 *
 * Flow:
 *   POST /generate            → tạo task, trả taskId NGAY (không chờ Facemint)
 *   GET  /status/:taskId      → client poll endpoint này để biết tiến độ
 *
 * Background worker:
 *   Sau khi trả taskId, server tự poll Facemint → download ảnh kết quả
 *   → upload lên S3 → cập nhật task trong store.
 */

import { Request, Response } from "express";
import axios from "axios";
import sharp from "sharp";
import { randomUUID } from "crypto";
import { StatusCodes } from "http-status-codes";
import { wrapAsync } from "../../../util/wrapAsync";
import ioCustom from "../../../util/ioCustom";
import { uploadImageBufferToPublicUrl } from "../../../services/storage/cloudStorage.service";
import {
  createFacemintTask,
  pollFacemintTask,
  FaceSwapOptions,
} from "../../../services/ai/faceSwap.service";
import {
  createTaskRecord,
  getTaskRecord,
  updateTaskRecord,
} from "./taskStore";

// ---------------------------------------------------------------------------
// Facemint API Key Pool — round-robin across multiple accounts
// Env vars: FACEMINT_API_KEY_1, FACEMINT_API_KEY_2, ...
// Fallback:  FACEMINT_API_KEY (single key, backwards compatible)
// ---------------------------------------------------------------------------
const _facemintKeys: string[] = (() => {
  const keys: string[] = [];
  for (let i = 1; ; i++) {
    const k = process.env[`FACEMINT_API_KEY_${i}`];
    if (!k) break;
    keys.push(k);
  }
  if (keys.length === 0 && process.env.FACEMINT_API_KEY) {
    keys.push(process.env.FACEMINT_API_KEY);
  }
  return keys;
})();

let _keyIndex = 0;

/** Trả về API key tiếp theo theo round-robin. Throw nếu chưa cấu hình key nào. */
function getNextApiKey(): string {
  if (_facemintKeys.length === 0) {
    throw new Error(
      "Chưa cấu hình Facemint API key. Đặt FACEMINT_API_KEY_1 / FACEMINT_API_KEY_2 (hoặc FACEMINT_API_KEY)."
    );
  }
  const key = _facemintKeys[_keyIndex % _facemintKeys.length];
  _keyIndex = (_keyIndex + 1) % _facemintKeys.length; // reset để tránh overflow dài hạn
  return key;
}

/** Nén ảnh xuống kích thước mục tiêu (mặc định ~200KB) */
async function compressImage(
  buffer: Buffer,
  targetSizeKB: number = 200
): Promise<{ buffer: Buffer; mimetype: string }> {
  const targetBytes = targetSizeKB * 1024;

  if (buffer.length <= targetBytes) {
    const output = await sharp(buffer).jpeg({ quality: 90 }).toBuffer();
    return { buffer: output, mimetype: "image/jpeg" };
  }

  let quality = Math.round((targetBytes / buffer.length) * 100 * 1.8);
  quality = Math.max(20, Math.min(quality, 92));

  let output = await sharp(buffer)
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();

  while (output.length > targetBytes && quality > 20) {
    quality -= 5;
    output = await sharp(buffer)
      .jpeg({ quality: Math.max(20, quality), mozjpeg: true })
      .toBuffer();
  }

  while (output.length < targetBytes * 0.7 && quality < 92) {
    quality += 5;
    output = await sharp(buffer)
      .jpeg({ quality: Math.min(92, quality), mozjpeg: true })
      .toBuffer();
  }

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
 * Background worker — chạy fire-and-forget sau khi /generate trả response.
 * Poll Facemint → download → upload S3 → update store.
 */
async function processFaceSwapTask(params: {
  taskId: string;
  apiKey: string;
  options: FaceSwapOptions;
  baseName: string;
}) {
  const { taskId, apiKey, options, baseName } = params;

  try {
    const facemintTaskId = await createFacemintTask(apiKey, options);
    updateTaskRecord(taskId, {
      facemintTaskId,
      status: "processing",
    });

    const aiTempUrl = await pollFacemintTask(apiKey, facemintTaskId, {
      timeoutMs: 300_000,
      onProgress: ({ state, process: pct }) => {
        if (pct !== undefined) {
          updateTaskRecord(taskId, { progress: pct });
        }
        console.log(
          `[FaceSwap ${taskId}] Facemint state=${state} progress=${pct ?? "?"}`
        );
      },
    });

    console.log(`[FaceSwap ${taskId}] Downloading result from:`, aiTempUrl);
    const aiImageResponse = await axios.get<ArrayBuffer>(aiTempUrl, {
      responseType: "arraybuffer",
      timeout: 60000,
    });
    const aiBuffer = Buffer.from(aiImageResponse.data);

    const compressedAi = await compressImage(aiBuffer, 500);
    const generatedFileName = `${baseName}-generated.jpg`;
    const generatedUrl = await uploadImageBufferToPublicUrl(
      compressedAi.buffer,
      generatedFileName,
      compressedAi.mimetype
    );

    updateTaskRecord(taskId, {
      status: "done",
      generatedUrl,
      progress: 100,
    });
    console.log(`[FaceSwap ${taskId}] Done. generatedUrl=${generatedUrl}`);
  } catch (err: any) {
    const message = err?.message || String(err);
    console.error(`[FaceSwap ${taskId}] Failed:`, message);
    updateTaskRecord(taskId, {
      status: "failed",
      error: message,
    });
  }
}

/**
 * POST /api/ai/face-swap/generate
 * Multipart body:
 *   - image: file ảnh user (required)
 *   - name: tên cơ sở file (required)
 *   - target_face: URL ảnh target (required)
 *   - ref_face: URL crop mặt target (optional)
 *   - resolution: 1..6 (optional, default 3)
 *   - enhance: 0 | 1 (optional, default 1)
 *
 * Trả về 202 Accepted: { taskId, originalUrl, baseName, status: "pending" }
 * Client tiếp tục gọi GET /status/:taskId để lấy kết quả.
 */
export const generate = wrapAsync(async (req: Request, res: Response) => {
  const file = req.file;
  const { name, target_face, ref_face, resolution, enhance } = req.body;

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

  let apiKey: string;
  try {
    apiKey = getNextApiKey();
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      ioCustom.toResponseError({
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "FACEMINT_API_KEY chưa được cấu hình trên server.",
      })
    );
    return;
  }

  const safeName = name
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "");
  const baseName = safeName;

  // Nén + upload ảnh user (đồng bộ — nhanh, ~1-2s, cần xong để có URL gửi Facemint)
  const compressed = await compressImage(file.buffer, 200);
  const originalFileName = `${baseName}-original.jpg`;
  const originalUrl = await uploadImageBufferToPublicUrl(
    compressed.buffer,
    originalFileName,
    compressed.mimetype
  );

  const taskId = randomUUID();
  const options: FaceSwapOptions = {
    userImageUrl: originalUrl,
    targetImageUrl: target_face,
    type: "image",
    resolution: resolution ? Number(resolution) : undefined,
    enhance: enhance !== undefined ? Number(enhance) : undefined,
  };
  if (ref_face) options.refFaceUrl = ref_face;

  createTaskRecord({
    taskId,
    facemintTaskId: "",
    status: "pending",
    originalUrl,
    baseName,
  });

  // Fire-and-forget — background worker
  processFaceSwapTask({ taskId, apiKey, options, baseName }).catch((err) => {
    console.error(`[FaceSwap ${taskId}] Unhandled worker error:`, err);
  });

  res.status(StatusCodes.ACCEPTED).json(
    ioCustom.toResponse(StatusCodes.ACCEPTED, "Task đã được khởi tạo", {
      taskId,
      status: "pending",
      originalUrl,
      baseName,
    })
  );
});

/**
 * GET /api/ai/face-swap/status/:taskId
 * Trả về trạng thái hiện tại của task — client poll endpoint này.
 */
export const getStatus = wrapAsync(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const task = getTaskRecord(taskId);

  if (!task) {
    res.status(StatusCodes.NOT_FOUND).json(
      ioCustom.toResponseError({
        code: StatusCodes.NOT_FOUND,
        message: "Task không tồn tại hoặc đã hết hạn.",
      })
    );
    return;
  }

  res.status(StatusCodes.OK).json(
    ioCustom.toResponse(StatusCodes.OK, "OK", {
      taskId: task.taskId,
      status: task.status,
      progress: task.progress,
      originalUrl: task.originalUrl,
      generatedUrl: task.generatedUrl,
      baseName: task.baseName,
      error: task.error,
    })
  );
});
