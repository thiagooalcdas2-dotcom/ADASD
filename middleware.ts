import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";

const roleRoutes: Record<string, string[]> = {
  "/staff": ["STAFF", "ADMIN", "ADMIN_TAZ"],
  "/admin": ["ADMIN", "ADMIN_TAZ"]
};

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  for (const [prefix, roles] of Object.entries(roleRoutes)) {
    if (pathname.startsWith(prefix)) {
      const token = req.cookies.get("accessToken")?.value;
      if (!token) return NextResponse.redirect(new URL("/login", req.url));
      try {
        const user = verifyAccessToken(token);
        if (!roles.includes(user.role)) {
          return NextResponse.redirect(new URL("/", req.url));
        }
      } catch {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/staff/:path*", "/admin/:path*"]
};
