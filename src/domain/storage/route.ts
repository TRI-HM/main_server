import { Router } from "express";
import { uploadToCloud } from "./controller";
import { uploadImageMemory } from "../../util/multherMemory";

const router = Router();

router.post("/upload", uploadImageMemory.single("image"), uploadToCloud);

export default router;
