import { Router } from "express";
import { Authenticated } from "../middleware/authenticated";

const router = Router();

router.get("/", Authenticated, (req, res) => {
  res.send("You are authenticated!");
});

export default router;
