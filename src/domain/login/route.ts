import { Router } from "express";
import { signin } from "./controller";
import { register } from "./controller";

const router = Router();

router.post("/register", register);
router.post("/signin", signin);

export default router;