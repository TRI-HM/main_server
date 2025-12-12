import { Router } from "express";
import videoController from "./controller";
import { uploadVideoMulterHandle } from "../../middleware/videoMulther";

const router = Router();
router.post("/post", uploadVideoMulterHandle.single('video'), videoController.postVideo);

export default router;