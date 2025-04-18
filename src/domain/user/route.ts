import { Router } from "express";
import userController from "./controller";

const router = Router();

router.post("/create", userController.create); // POST /api/user/create
router.patch("/update/:uuid", userController.update); // PATCH /api/user/update/:uuid
router.get("/get/:uuid", userController.getOne); // GET /api/user/get/:uuid
router.get("/getAll", userController.getAll); // GET /api/user/getAll

export default router;