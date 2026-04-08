/**
 * Route cho NanoBanana2 AI image generation.
 *
 * Endpoints:
 *   POST /api/nano-banana-2/generate
 *     - multipart/form-data: image (file), name (string), prompt (string)
 *     - Trả về: { originalUrl, generatedUrl, baseName }
 */

import { Router } from "express";
import { generate, generateTest } from "./controller";
import { uploadImageMemory } from "../../../util/multherMemory";

const router = Router();

// uploadImageMemory: lưu ảnh vào memory buffer → controller upload lên cloud
router.post("/generate", uploadImageMemory.single("image"), generate);
// router test để client gửi ảnh lên mà không cần generate AI và upload cloud storage, dùng ảnh mẫu có sẵn trên server
router.post("/test-generate", uploadImageMemory.single("image"), generateTest); // API /api/ai/nano-banana-2/test-generate

export default router;
