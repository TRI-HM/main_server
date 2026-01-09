import { Router } from "express";
import { zaloController } from "./controller";

const router = Router();

router.post("/webhook", zaloController.RecieveWebhook);

router.get("/verifier", zaloController.verify);
export default router;


