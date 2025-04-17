import { Router, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

const router = Router();

router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Dummy authentication logic
  if (username === "user" && password === "password") {
    const token = jwt.sign({ username }, process.env.JWT_SECRET as Secret, {
      expiresIn: "1h",
    });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
}
);

export default router;
