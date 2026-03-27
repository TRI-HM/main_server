import { Router } from "express";
import { signin } from "./controller";
import { register } from "./controller";
import { validateOTP } from "../../middleware/optValidation.middleware";

const router = Router();

router.post("/register", register); // localhost:9456/api/login/register
router.post("/signin", signin); // localhost:9456/api/login/signin

export default router;