import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

function getSecret(): string {
  const secret = process.env["SESSION_SECRET"];
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return secret;
}

export interface JwtPayload {
  sub: string;
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, getSecret()) as JwtPayload;
}

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, getSecret(), {
    algorithm: "HS256",
    expiresIn: "7d",
  });
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or malformed Authorization header" });
    return;
  }

  const token = authHeader.slice(7);
  try {
    const payload = verifyToken(token);
    res.locals["userId"] = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
