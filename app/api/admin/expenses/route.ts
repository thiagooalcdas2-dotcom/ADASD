import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/http";
import { canAccessRole, getUserFromRequest } from "@/lib/auth/guards";
import { expenseSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user || !canAccessRole(user.role, ["ADMIN", "ADMIN_TAZ"])) return fail("Sem permissão", 403);
  return ok(await prisma.expense.findMany({ orderBy: { date: "desc" } }));
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user || !canAccessRole(user.role, ["ADMIN", "ADMIN_TAZ"])) return fail("Sem permissão", 403);
  const parsed = expenseSchema.safeParse(await req.json());
  if (!parsed.success) return fail(parsed.error.message, 422);
  const expense = await prisma.expense.create({ data: { ...parsed.data, date: new Date(parsed.data.date), createdByUserId: user.id } });
  await prisma.auditLog.create({ data: { actorUserId: user.id, action: "CREATE", entityType: "EXPENSE", entityId: expense.id, afterJson: expense as any } });
  return ok(expense, 201);
}
