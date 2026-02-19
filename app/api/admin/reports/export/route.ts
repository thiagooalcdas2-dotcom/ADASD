import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessRole, getUserFromRequest } from "@/lib/auth/guards";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user || !canAccessRole(user.role, ["ADMIN", "ADMIN_TAZ"])) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const from = req.nextUrl.searchParams.get("from");
  const to = req.nextUrl.searchParams.get("to");
  const orders = await prisma.order.findMany({ where: from && to ? { createdAt: { gte: new Date(from), lte: new Date(to) } } : undefined });
  const expenses = await prisma.expense.findMany({ where: from && to ? { date: { gte: new Date(from), lte: new Date(to) } } : undefined });

  const lines = ["tipo,id,data,valor,status"];
  orders.forEach((o) => lines.push(`pedido,${o.id},${o.createdAt.toISOString()},${o.total},${o.status}`));
  expenses.forEach((e) => lines.push(`despesa,${e.id},${e.date.toISOString()},${e.amount},${e.category}`));

  return new NextResponse(lines.join("\n"), { headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=finance-report.csv" } });
}
