import { PrismaClient, Prisma, Role, OrderStatus, OrderType, ExpenseCategory, ExpenseMethod } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.ticketMessage.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.revenueAdjustment.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("123456", 10);
  const users = await Promise.all([
    prisma.user.create({ data: { name: "TAZ Master", email: "taz@resto.com", passwordHash, role: Role.ADMIN_TAZ } }),
    prisma.user.create({ data: { name: "Gerente Ana", email: "admin@resto.com", passwordHash, role: Role.ADMIN } }),
    prisma.user.create({ data: { name: "Staff João", email: "staff1@resto.com", passwordHash, role: Role.STAFF } }),
    prisma.user.create({ data: { name: "Staff Maria", email: "staff2@resto.com", passwordHash, role: Role.STAFF } }),
    prisma.user.create({ data: { name: "Cliente Lucas", email: "cliente1@resto.com", passwordHash, role: Role.CLIENT } }),
    prisma.user.create({ data: { name: "Cliente Carla", email: "cliente2@resto.com", passwordHash, role: Role.CLIENT } })
  ]);

  const [cat1, cat2, cat3] = await Promise.all([
    prisma.menuCategory.create({ data: { name: "Entradas", sortOrder: 1 } }),
    prisma.menuCategory.create({ data: { name: "Pratos", sortOrder: 2 } }),
    prisma.menuCategory.create({ data: { name: "Bebidas", sortOrder: 3 } })
  ]);

  const menuItems = await Promise.all(Array.from({ length: 10 }, (_, i) => prisma.menuItem.create({
    data: {
      categoryId: i < 3 ? cat1.id : i < 7 ? cat2.id : cat3.id,
      name: `Item ${i + 1}`,
      description: `Descrição do item ${i + 1}`,
      price: new Prisma.Decimal((20 + i * 3).toFixed(2)),
      isAvailable: true
    }
  })));

  const clientUsers = users.filter((u) => u.role === Role.CLIENT);
  const orderStatuses: OrderStatus[] = ["NEW", "PREPARING", "READY", "DELIVERED", "CANCELED"];
  const orderTypes: OrderType[] = ["DELIVERY", "PICKUP", "TABLE"];

  for (let i = 0; i < 15; i++) {
    const status = orderStatuses[i % orderStatuses.length];
    const type = orderTypes[i % orderTypes.length];
    const item = menuItems[i % menuItems.length];
    const qty = (i % 3) + 1;
    const total = Number(item.price) * qty;
    await prisma.order.create({
      data: {
        userId: clientUsers[i % clientUsers.length].id,
        type,
        status,
        total: new Prisma.Decimal(total.toFixed(2)),
        paid: status === "DELIVERED",
        address: type === "DELIVERY" ? `Rua ${i + 10}, Centro` : null,
        items: {
          create: [{ menuItemId: item.id, quantity: qty, unitPrice: item.price }]
        }
      }
    });
  }

  const categories = Object.values(ExpenseCategory);
  const methods = Object.values(ExpenseMethod);
  for (let i = 0; i < 20; i++) {
    await prisma.expense.create({
      data: {
        createdByUserId: users[1].id,
        date: new Date(Date.now() - i * 86400000),
        amount: new Prisma.Decimal((100 + i * 17).toFixed(2)),
        category: categories[i % categories.length],
        method: methods[i % methods.length],
        vendor: `Fornecedor ${i + 1}`,
        notes: "Despesa seed"
      }
    });
  }

  console.log("Seed concluído.");
}

main().finally(() => prisma.$disconnect());
