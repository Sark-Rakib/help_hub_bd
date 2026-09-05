import type { NextProxy } from "next/server";
import { NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

const PROTECTED_ROUTES = {
  dashboard: ["/dashboard"],
  provider: ["/provider"],
  admin: ["/admin"],
} as const;

const ROLE_BY_PREFIX: Array<{
  prefix: string;
  roles: Array<"user" | "provider" | "admin">;
}> = [
  { prefix: "/admin", roles: ["admin"] },
  { prefix: "/provider", roles: ["provider", "admin"] },
  { prefix: "/dashboard", roles: ["user"] },
];

const ROLE_DASHBOARD: Record<"user" | "provider" | "admin", string> = {
  user: "/dashboard",
  provider: "/provider",
  admin: "/admin",
};

function matchProtected(prefix: string): boolean {
  return Object.values(PROTECTED_ROUTES).some((routes) =>
    routes.some((r) => prefix === r || prefix.startsWith(`${r}/`))
  );
}

export const proxy: NextProxy = async (request) => {
  const { pathname } = request.nextUrl;

  // Public API routes that manage their own auth — let them through.
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (!matchProtected(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? verifyToken(token) : null;

  // Not logged in → redirect to login with return path
  if (!payload) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access
  const rule = ROLE_BY_PREFIX.find(
    (r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`)
  );

  if (rule && !rule.roles.includes(payload.role)) {
    const dash = ROLE_DASHBOARD[payload.role];
    return NextResponse.redirect(new URL(dash, request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/dashboard/:path*", "/provider/:path*", "/admin/:path*"],
};