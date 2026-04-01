/**
 * Route cho NanoBanana2 AI image generation.
 *
 * Endpoints:
 *   POST /api/nano-banana-2/generate
 *     - multipart/form-data: image (file), name (string), prompt (string)
 *     - Trả về: { originalUrl, generatedUrl, baseName }
 */

import { Router } from "express";
import { generate } from "./controller";
import { uploadImageMemory } from "../../../util/multherMemory";

const router = Router();

// uploadImageMemory: lưu ảnh vào memory buffer → controller upload lên cloud
router.post("/generate", uploadImageMemory.single("image"), generate);

export default router;
