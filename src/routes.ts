import { Router } from "express";
import usersController from "./controllers/usersController";
import authController from "./controllers/authController";

const router = Router();

// router.use("/auth", authController);
router.use("/users", usersController);

export default router;