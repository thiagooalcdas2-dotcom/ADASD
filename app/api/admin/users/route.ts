import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessRole, getUserFromRequest } from "@/lib/auth/guards";
import { fail, ok } from "@/lib/http";
import { hashPassword } from "@/lib/auth/password";
import { z } from "zod";

const schema = z.object({ name: z.string(), email: z.string().email(), password: z.string().min(6), role: z.enum(["STAFF", "ADMIN", "ADMIN_TAZ", "CLIENT"]) });

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user || !canAccessRole(user.role, ["ADMIN", "ADMIN_TAZ"])) return fail("Sem permissão", 403);
  return ok(await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true } }));
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user || !canAccessRole(user.role, ["ADMIN", "ADMIN_TAZ"])) return fail("Sem permissão", 403);
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return fail(parsed.error.message, 422);
  const created = await prisma.user.create({ data: { ...parsed.data, passwordHash: await hashPassword(parsed.data.password) }, select: { id: true, name: true, email: true, role: true } });
  await prisma.auditLog.create({ data: { actorUserId: user.id, action: "CREATE", entityType: "USER", entityId: created.id, afterJson: created as any } });
  return ok(created, 201);
}
