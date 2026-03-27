import { Router } from "express";
import { kontextToImage, test_textToImage } from "./controller";
import { validateJWTMiddleware } from "../../../middleware/validateJWT.middleware";
import { uploadImageMemory } from "../../../util/multherMemory";

const router = Router();

router.get("/text-to-image", validateJWTMiddleware, test_textToImage); // GET .../api/ai/flux/text-to-image
router.post(
  "/kontext-to-image",
  uploadImageMemory.single("image"),
  kontextToImage
); // POST multipart: image + prompt

export default router;