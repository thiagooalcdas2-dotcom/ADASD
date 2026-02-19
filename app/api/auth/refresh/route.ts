import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/http";
import { signAccessToken, verifyRefreshToken } from "@/lib/auth/jwt";

export async function POST(req: Request) {
  const { refreshToken } = await req.json();
  if (!refreshToken) return fail("refreshToken obrigatório", 422);
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user) return fail("Usuário não encontrado", 404);
    return ok({ accessToken: signAccessToken({ id: user.id, email: user.email, role: user.role, name: user.name }) });
  } catch {
    return fail("refreshToken inválido", 401);
  }
}
