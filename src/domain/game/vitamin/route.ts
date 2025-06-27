import { Router } from "express";
import vitaminController from "./controller";

const router = Router();

router.post("/create", vitaminController.create); // POST /api/game/vitamin/create
router.get("/get/:id", vitaminController.getOne); // GET /api/game/vitamin/get/:id
router.get("/getAll", vitaminController.getAll); // GET /api/game/vitamin/getAll

export default router;