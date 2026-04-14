/**
 * Route cho Face Swap AI (async flow).
 *
 * Endpoints:
 *   POST /api/ai/face-swap/generate          → tạo task, trả taskId ngay (202)
 *   GET  /api/ai/face-swap/status/:taskId    → client poll để lấy kết quả
 *
 * Xem CLIENT_SPEC.md trong cùng thư mục để biết cách frontend cần tích hợp.
 */

import { Router } from "express";
import { generate, getStatus } from "./controller";
import { uploadImageMemory } from "../../../util/multherMemory";

const router = Router();

router.post("/generate", uploadImageMemory.single("image"), generate);
router.get("/status/:taskId", getStatus);

export default router;
