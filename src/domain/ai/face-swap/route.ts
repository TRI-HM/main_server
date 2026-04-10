/**
 * Route cho Face Swap AI — hoán đổi khuôn mặt từ ảnh user sang target_face.
 *
 * Endpoints:
 *   POST /api/ai/face-swap/generate
 *     - multipart/form-data: image (file), name (string), target_face (URL string)
 *     - Optional body: resolution (1..6), enhance (0 | 1)
 *     - Trả về: { originalUrl, generatedUrl, baseName }
 */

import { Router } from "express";
import { generate } from "./controller";
import { uploadImageMemory } from "../../../util/multherMemory";

const router = Router();

// uploadImageMemory: lưu ảnh vào memory buffer → controller upload lên cloud
router.post("/generate", uploadImageMemory.single("image"), generate);

export default router;
