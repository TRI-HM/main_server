import { Router } from "express";
import imageController from "./controller";
import { uploadMulterHandle } from "../../middleware/multher";

const router = Router();

router.get("/get/:uuid", imageController.getOne); // GET /api/image/get/:uuid
router.post("/upload", uploadMulterHandle.single('image'), imageController.upload); // POST /api/image/upload


export default router;