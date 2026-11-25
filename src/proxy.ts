import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_ROUTES = ["/employees", "/activity-logs", "/settings"];

const PUBLIC_ROUTES = [
  "/signin",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

const matches = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`);

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname, search } = req.nextUrl;

  const expired = !!token?.sessionExpires && Date.now() > token.sessionExpires;

  const isAuth = !!token && !token.error && !expired;
  const isAdmin = isAuth && token?.role === "admin";

  // Public authentication pages
  if (PUBLIC_ROUTES.some((route) => matches(pathname, route))) {
    if (pathname === "/signin" && isAuth) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  }

  // Protect private routes
  if (!isAuth) {
    const url = new URL("/signin", req.url);
    url.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  // Protect admin routes
  if (ADMIN_ROUTES.some((route) => matches(pathname, route)) && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
