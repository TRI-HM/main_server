import { Router } from "express";
import imageController from "./controller";

const router = Router();

router.get("/get/:uuid", imageController.getOne); // GET /api/image/get/:uuid
router.post("/upload", imageController.upload); // POST /api/image/upload


export default router;