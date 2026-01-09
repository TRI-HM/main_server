import { Router } from "express";
import { textToMusic } from "./controller";

const router = Router();

router.post("/text-to-music", textToMusic); // localhost:3000/api/ai/elevenlabs/text-to-music

export default router;