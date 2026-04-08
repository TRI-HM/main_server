import { Router } from "express";
import userRouter from "./user/route";
import imageRouter from "./image/route";
import vitaminRouter from "./game/vitamin/route";
import loginRouter from "./login/route";
import videoRouter from "./video/route";
import aiRouter from "./ai/route";
import checkInRouter from "./game/checkIn/router";
import storageRouter from "./storage/route";
import nanoBanana2Router from "./ai/nano-banana-2/route";

const router = Router();

router.get("/ping", (req, res) => {
  res.send({ message: "Welcome to server", data: "pong" });
});

router.use("/user", userRouter);
router.use("/image", imageRouter);
router.use("/login", loginRouter);
router.use("/video", videoRouter);
router.use("/ai", aiRouter);
router.use("/game/vitamin", vitaminRouter);
// router.use("/game/check-in", checkInRouter);
router.use("/storage", storageRouter);
router.use("/nano-banana-2", nanoBanana2Router);
export default router;