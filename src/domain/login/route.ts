import { Router } from "express";
import { signin } from "./controller";
import { register } from "./controller";
import { validateOTP } from "../../middleware/optValidation.middleware";

const router = Router();

router.post("/register", register);
router.post("/signin", signin);
// router.post("/validate-otp", validateOTP);

export default router;