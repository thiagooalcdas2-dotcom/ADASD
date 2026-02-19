import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/http";
import { canAccessRole, getUserFromRequest } from "@/lib/auth/guards";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user || !canAccessRole(user.role, ["ADMIN", "ADMIN_TAZ", "STAFF"])) return fail("Sem permissão", 403);
  const from = req.nextUrl.searchParams.get("from");
  const to = req.nextUrl.searchParams.get("to");
  const where = from && to ? { createdAt: { gte: new Date(from), lte: new Date(to) } } : {};
  const delivered = await prisma.order.findMany({ where: { ...where, paid: true, status: "DELIVERED" } });
  const expenses = await prisma.expense.findMany({ where: from && to ? { date: { gte: new Date(from), lte: new Date(to) } } : undefined });
  const adjustments = await prisma.revenueAdjustment.findMany({ where: from && to ? { date: { gte: new Date(from), lte: new Date(to) } } : undefined });

  const revenue = delivered.reduce((acc, o) => acc + Number(o.total), 0) + adjustments.reduce((acc, a) => acc + Number(a.amount), 0);
  const expenseTotal = expenses.reduce((acc, e) => acc + Number(e.amount), 0);
  const profit = revenue - expenseTotal;
  const avgTicket = delivered.length ? revenue / delivered.length : 0;
  const margin = revenue ? (profit / revenue) * 100 : 0;

  return ok({ revenue, expenseTotal, profit, avgTicket, margin, ordersDelivered: delivered.length });
}
