import { Router, type IRouter } from "express";
import { signToken } from "../middlewares/auth";
import crypto from "crypto";

const router: IRouter = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/auth/login", (req, res) => {
  const { email } = req.body as { email?: unknown };
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }

  const userId = crypto
    .createHash("sha256")
    .update(email.toLowerCase())
    .digest("hex")
    .slice(0, 32);

  const token = signToken(userId);
  res.json({ token, userId, expiresIn: 60 * 60 * 24 * 7 });
});

export default router;
