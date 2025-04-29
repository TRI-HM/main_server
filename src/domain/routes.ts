import { Router } from "express";
import userRouter from "./user/route";
import imageRouter from "./image/route";
const router = Router();

router.use("/user", userRouter);
router.use("/image", imageRouter);

export default router;