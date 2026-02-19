import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

export type SessionUser = {
  id: string;
  email: string;
  role: Role;
  name: string;
};

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret";

export function signAccessToken(user: SessionUser) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });
}

export function signRefreshToken(user: SessionUser) {
  return jwt.sign({ sub: user.id }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): SessionUser {
  return jwt.verify(token, JWT_SECRET) as SessionUser;
}

export function verifyRefreshToken(token: string): { sub: string } {
  return jwt.verify(token, JWT_REFRESH_SECRET) as { sub: string };
}
