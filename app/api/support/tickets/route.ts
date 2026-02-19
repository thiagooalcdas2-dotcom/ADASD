import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/http";
import { getUserFromRequest } from "@/lib/auth/guards";
import { z } from "zod";

const schema = z.object({ subject: z.string().min(3), message: z.string().min(3) });

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return fail("Não autenticado", 401);
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return fail(parsed.error.message, 422);
  const ticket = await prisma.ticket.create({
    data: {
      userId: user.id,
      subject: parsed.data.subject,
      messages: { create: { senderRole: "CLIENT", message: parsed.data.message } }
    },
    include: { messages: true }
  });
  return ok(ticket, 201);
}

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return fail("Não autenticado", 401);
  const tickets = await prisma.ticket.findMany({
    where: user.role === "CLIENT" ? { userId: user.id } : undefined,
    include: { messages: true }
  });
  return ok(tickets);
}
