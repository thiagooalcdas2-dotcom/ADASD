import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessRole, getUserFromRequest } from "@/lib/auth/guards";
import { fail, ok } from "@/lib/http";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user || !canAccessRole(user.role, ["ADMIN", "ADMIN_TAZ"])) return fail("Sem permissão", 403);
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return ok(logs);
}
