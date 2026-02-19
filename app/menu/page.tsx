import { prisma } from "@/lib/prisma";

export default async function MenuPage() {
  const items = await prisma.menuItem.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });
  return <div className="py-6"><h1 className="mb-4 text-2xl font-bold">Cardápio</h1><div className="grid gap-3 md:grid-cols-2">{items.map((item) => <div key={item.id} className="rounded-xl border bg-white p-4"><p className="text-xs text-slate-500">{item.category.name}</p><h2 className="font-semibold">{item.name}</h2><p className="text-sm">{item.description}</p><p className="font-bold">R$ {Number(item.price).toFixed(2)}</p></div>)}</div></div>;
}
