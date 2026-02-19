import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/http";
import { registerSchema } from "@/lib/validators";
import { hashPassword } from "@/lib/auth/password";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.message, 422);

  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) return fail("Email já cadastrado", 409);

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: await hashPassword(parsed.data.password),
      role: "CLIENT"
    },
    select: { id: true, name: true, email: true, role: true }
  });

  return ok(user, 201);
}
