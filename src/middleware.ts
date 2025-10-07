import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { SESSION_COOKIE } from "./lib/firebase/config";

// 1. Specify protected and public routes
const protectedRoutes = ["/onboarding"];
const publicRoutes = ["/"];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const authId = (await cookies()).get(SESSION_COOKIE)?.value;

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !authId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // 5. Redirect to /onboarding if the user is authenticated
  if (isPublicRoute && authId && path !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
