import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ONLY these exact paths are allowed for public access
const PUBLIC_WHITELIST = new Set([
  "/",
  "/about",
  "/support",
  "/auth/login",
  "/auth/signup",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract authentication token from cookies or session
  const token =
    request.cookies.get("token")?.value ||
    request.cookies.get("digivibe_token")?.value ||
    request.cookies.get("next-auth.session-token")?.value;
  const isAuthenticated = Boolean(token);

  // Normalize pathname by stripping locale prefix (e.g., /en/about -> /about)
  const localeMatch = pathname.match(/^\/(en|bn)(\/.*)?$/);
  const locale = localeMatch ? localeMatch[1] : "en";
  const normalizedPath = localeMatch ? localeMatch[2] || "/" : pathname;

  // Check if current route is in the public whitelist
  const isPublic = PUBLIC_WHITELIST.has(normalizedPath);

  // 1. Block access to ALL non-public routes if user is NOT authenticated
  if (!isPublic && !isAuthenticated) {
    const loginUrl = new URL(`/${locale}/auth/login`, request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirect logged-in users away from Login/Signup pages
  const isAuthPage = normalizedPath === "/auth/login" || normalizedPath === "/auth/signup";
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL(`/${locale}/services`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files, images, favicons, and API endpoints
     */
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
