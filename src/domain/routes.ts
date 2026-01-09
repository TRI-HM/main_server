import { Router } from "express";
import userRouter from "./user/route";
import imageRouter from "./image/route";
import vitaminRouter from "./game/vitamin/route";
import loginRouter from "./login/route";
import videoRouter from "./video/route";
import aiRouter from "./ai/route";
import PepsiGameRouter from "./game/CheckInPlayGame/router";

const router = Router();

router.get("/ping", (req, res) => {
  res.send({ message: "Welcome to server", data: "pong" });
});

router.use("/user", userRouter);
router.use("/image", imageRouter);
router.use("/game/vitamin", vitaminRouter);
router.use("/login", loginRouter);
router.use("/video", videoRouter);
router.use("/ai", aiRouter);
router.use("/game/pepsi", PepsiGameRouter);
export default router;