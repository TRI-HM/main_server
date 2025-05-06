import { Router } from "express";
import userController from "./controller";

const router = Router();

router.post("/create", userController.create); // POST /api/user/create
router.patch("/update/:uuid", userController.update); // PATCH /api/user/update/:uuid
router.get("/get/:uuid", userController.getOne); // GET /api/user/get/:uuid
router.get("/getAll", userController.getAll); // GET /api/user/getAll

//TODO: làm lại phần này, vì vote sẽ được ghi vào note của user, không cần phải update lại user
// router.patch("/update/vote/:phone/:vote", userController.updateVote); // PATCH /api/user/update/vote/:phone

export default router;