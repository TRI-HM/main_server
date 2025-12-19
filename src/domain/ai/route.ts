import { Router } from "express";
import textToMusicRouter from "./elevenlabs/textToMusic/route";

const router = Router();

router.use("/elevenlabs", textToMusicRouter);

export default router;