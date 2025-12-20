import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "./infrastracture/shared/constants";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/auth") {
    return NextResponse.next();
  }

  const authCookie = req.cookies.get(AUTH_COOKIE_NAME);

  if (!authCookie) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
