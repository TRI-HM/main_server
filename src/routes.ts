import { Router } from "express";
import authController from "./controllers/authController";
import usersController from "./controllers/usersController";

const router = Router();

router.use("/auth", authController);
router.use("/users", usersController);

export default router;