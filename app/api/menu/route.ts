import { prisma } from "@/lib/prisma";
import { ok } from "@/lib/http";

export async function GET() {
  const items = await prisma.menuItem.findMany({ where: { isAvailable: true }, include: { category: true } });
  return ok(items);
}
