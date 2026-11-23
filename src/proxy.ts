import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_ROUTES = ["/employees", "/activity-logs", "/settings"];
const matches = (pathname: string, route: string) => pathname === route || pathname.startsWith(`${route}/`);

/**
 * Page-level guard (UX + first line of defence). The REAL authorization is enforced by the API on every request.
 */
export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname, search } = req.nextUrl;

  const expired = !!token?.sessionExpires && Date.now() > token.sessionExpires;
  const isAuth = !!token && !token.error && !expired;
  const isAdmin = isAuth && token?.role === "admin";

  if (pathname === "/signin") {
    return isAuth ? NextResponse.redirect(new URL("/", req.url)) : NextResponse.next();
  }

  if (!isAuth) {
    const url = new URL("/signin", req.url);
    url.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  if (ADMIN_ROUTES.some((r) => matches(pathname, r)) && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

// everything except Next internals, NextAuth endpoints and static files
export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
