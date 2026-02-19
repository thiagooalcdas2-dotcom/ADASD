import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessRole, getUserFromRequest } from "@/lib/auth/guards";
import { fail, ok } from "@/lib/http";
import { z } from "zod";

const schema = z.object({ categoryId: z.string(), name: z.string(), description: z.string(), price: z.number(), isAvailable: z.boolean().default(true) });

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user || !canAccessRole(user.role, ["ADMIN", "ADMIN_TAZ"])) return fail("Sem permissão", 403);
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return fail(parsed.error.message, 422);
  const item = await prisma.menuItem.create({ data: parsed.data });
  await prisma.auditLog.create({ data: { actorUserId: user.id, action: "CREATE", entityType: "MENU_ITEM", entityId: item.id, afterJson: item as any } });
  return ok(item, 201);
}
