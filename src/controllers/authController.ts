// authController.ts
import { Router, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

const router = Router();

router.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email === "admin@example.com" && password === "123456") {
    const secret: Secret = process.env.JWT_SECRET as Secret;
    if (!secret) {
      return res.status(500).json({ message: "JWT_SECRET not defined" });
    }

    const token = jwt.sign({ email }, secret, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });

    return res.json({ token });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

export default router;
