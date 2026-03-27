import { Router } from "express";
import textToMusicRouter from "./elevenlabs/textToMusic/route";
import fluxRouter from "./flux/route";

const router = Router();

router.use("/elevenlabs", textToMusicRouter);
router.use("/flux", fluxRouter);

export default router;