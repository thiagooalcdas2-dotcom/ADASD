import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/auth/password";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { fail, ok } from "@/lib/http";
import { loginSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const parsed = loginSchema.safeParse(await req.json());
  if (!parsed.success) return fail(parsed.error.message, 422);

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await comparePassword(parsed.data.password, user.passwordHash))) return fail("Credenciais inválidas", 401);
  if (!user.isActive) return fail("Usuário bloqueado", 403);

  const sessionUser = { id: user.id, email: user.email, role: user.role, name: user.name };
  return ok({ accessToken: signAccessToken(sessionUser), refreshToken: signRefreshToken(sessionUser), user: sessionUser });
}
