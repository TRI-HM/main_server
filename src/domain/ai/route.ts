import { Router } from "express";
import textToMusicRouter from "./elevenlabs/textToMusic/route";
import nanoBanana2Router from "./nano-banana-2/route";
import faceSwapRouter from "./face-swap/route";

const router = Router();

router.use("/elevenlabs", textToMusicRouter);
router.use("/nano-banana-2", nanoBanana2Router);
router.use("/face-swap", faceSwapRouter);

export default router;