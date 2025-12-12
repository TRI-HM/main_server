import { Router } from "express";
import userRouter from "./user/route";
import imageRouter from "./image/route";
import vitaminRouter from "./game/vitamin/route";
import loginRouter from "./login/route";
import videoRouter from "./video/route";

const router = Router();

router.get("/ping", (req, res) => {
  res.send({ message: "Welcome to server", data: "pong" });
});

router.use("/user", userRouter);
router.use("/image", imageRouter);
router.use("/game/vitamin", vitaminRouter);
router.use("/login", loginRouter);
router.use("/video", videoRouter);
export default router;