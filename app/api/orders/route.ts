import { prisma } from "@/lib/prisma";
import { createOrderSchema } from "@/lib/validators";
import { fail, ok } from "@/lib/http";
import { getUserFromRequest } from "@/lib/auth/guards";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return fail("Não autenticado", 401);
  const parsed = createOrderSchema.safeParse(await req.json());
  if (!parsed.success) return fail(parsed.error.message, 422);

  const menuItems = await prisma.menuItem.findMany({ where: { id: { in: parsed.data.items.map((i) => i.menuItemId) } } });
  const total = parsed.data.items.reduce((sum, item) => {
    const found = menuItems.find((m) => m.id === item.menuItemId);
    return sum + (found ? Number(found.price) * item.quantity : 0);
  }, 0);

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      type: parsed.data.type,
      notes: parsed.data.notes,
      address: parsed.data.address,
      total,
      items: {
        create: parsed.data.items.map((item) => {
          const found = menuItems.find((m) => m.id === item.menuItemId)!;
          return { menuItemId: item.menuItemId, quantity: item.quantity, unitPrice: found.price, notes: item.notes };
        })
      }
    },
    include: { items: true }
  });

  return ok(order, 201);
}
