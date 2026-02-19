import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth/guards";
import { fail, ok } from "@/lib/http";
import { z } from "zod";

const schema = z.object({ dateTime: z.string(), peopleCount: z.number().min(1), notes: z.string().optional() });

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return fail("Não autenticado", 401);
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return fail(parsed.error.message, 422);
  const reservation = await prisma.reservation.create({ data: { userId: user.id, dateTime: new Date(parsed.data.dateTime), peopleCount: parsed.data.peopleCount, notes: parsed.data.notes } });
  return ok(reservation, 201);
}
