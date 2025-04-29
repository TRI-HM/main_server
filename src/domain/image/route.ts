import { Router } from "express";
import imageController from "./controller";

const router = Router();

// Todo: chưa có dùng được, cần phải dev lại.
router.get("/get/:uuid", imageController.getOne); // GET /api/image/get/:uuid

export default router;