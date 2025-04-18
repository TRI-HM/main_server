import { Router } from "express";
import userController from "./controllers/userController";
import authController from "./controllers/authController";

const router = Router();

// router.use("/auth", authController);
router.use("/user", userController);

export default router;