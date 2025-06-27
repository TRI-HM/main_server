import { Router } from "express";
import userRouter from "./user/route";
import imageRouter from "./image/route";
import vitaminRouter from "./game/vitamin/route";

const router = Router();

router.get("/ping", (req, res) => {
  res.send({ message: "Welcome to server", data: "pong" });
});

router.use("/user", userRouter);
router.use("/image", imageRouter);
router.use("/game/vitamin", vitaminRouter)

export default router;