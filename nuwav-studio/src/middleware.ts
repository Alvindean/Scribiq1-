import { auth } from "@/lib/auth/config";
import { NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/ratelimit/apply";

export default auth(async (req) => {
  const rl = await applyRateLimit(req);
  if (rl.limited && rl.response) return rl.response;

  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  const isDashboardRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/templates") ||
    pathname.startsWith("/music") ||
    pathname.startsWith("/settings");

  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  if (!isLoggedIn && isDashboardRoute) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isAuthRoute) {
    const dashboardUrl = req.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
