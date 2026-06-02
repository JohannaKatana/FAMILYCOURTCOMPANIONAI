import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { signToken } from "../middlewares/auth";

const router: IRouter = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BCRYPT_ROUNDS = 12;

router.post("/auth/register", async (req, res) => {
  const { email, password } = req.body as { email?: unknown; password?: unknown };

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }
  if (typeof password !== "string" || password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" });
    return;
  }

  try {
    const [existing] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase()));

    if (existing) {
      res.status(409).json({ error: "An account with that email already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const [user] = await db
      .insert(usersTable)
      .values({ email: email.toLowerCase(), passwordHash })
      .returning({ id: usersTable.id });

    const token = signToken(user!.id);
    res.status(201).json({ token, userId: user!.id, expiresIn: 60 * 60 * 24 * 7 });
  } catch (err) {
    req.log.error(err, "POST /auth/register failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body as { email?: unknown; password?: unknown };

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }
  if (typeof password !== "string" || password.length === 0) {
    res.status(400).json({ error: "Password is required" });
    return;
  }

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase()));

    const passwordMatch = user
      ? await bcrypt.compare(password, user.passwordHash)
      : await bcrypt.hash(password, BCRYPT_ROUNDS).then(() => false);

    if (!user || !passwordMatch) {
      res.status(401).json({ error: "Incorrect email or password" });
      return;
    }

    const token = signToken(user.id);
    res.json({ token, userId: user.id, expiresIn: 60 * 60 * 24 * 7 });
  } catch (err) {
    req.log.error(err, "POST /auth/login failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
