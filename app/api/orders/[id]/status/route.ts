import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/http";
import { canAccessRole, getUserFromRequest } from "@/lib/auth/guards";
import { updateOrderStatusSchema } from "@/lib/validators";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user || !canAccessRole(user.role, ["STAFF", "ADMIN", "ADMIN_TAZ"])) return fail("Sem permissão", 403);
  const parsed = updateOrderStatusSchema.safeParse(await req.json());
  if (!parsed.success) return fail(parsed.error.message, 422);

  const before = await prisma.order.findUnique({ where: { id: params.id } });
  if (!before) return fail("Pedido não encontrado", 404);

  const updated = await prisma.order.update({ where: { id: params.id }, data: { status: parsed.data.status } });
  await prisma.auditLog.create({ data: { actorUserId: user.id, action: "UPDATE_STATUS", entityType: "ORDER", entityId: params.id, beforeJson: before as any, afterJson: updated as any } });
  return ok(updated);
}
