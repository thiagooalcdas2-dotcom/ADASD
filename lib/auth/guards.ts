import { NextRequest } from "next/server";
import { Role } from "@prisma/client";
import { verifyAccessToken } from "@/lib/auth/jwt";

export function getUserFromRequest(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  try {
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}

export function canAccessRole(userRole: Role, allowed: Role[]) {
  if (userRole === "ADMIN_TAZ") return true;
  return allowed.includes(userRole);
}
