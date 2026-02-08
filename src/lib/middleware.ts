import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@better-auth/next"; // Better Auth middleware helper

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const user = session?.user;
  const role = user?.role; // "customer" | "seller" | "admin"

  /* ================= PUBLIC ROUTES ================= */
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/shop",
  ];

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  /* ================= NOT LOGGED IN ================= */
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  /* ================= CUSTOMER ROUTES ================= */
  if (
    ["/cart", "/checkout", "/orders", "/profile"].some((route) =>
      pathname.startsWith(route)
    )
  ) {
    if (role !== "customer") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  /* ================= SELLER ROUTES ================= */
  if (pathname.startsWith("/seller")) {
    if (role !== "seller") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  /* ================= ADMIN ROUTES ================= */
  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

/* ================= MATCHER ================= */
export const config = {
  matcher: [
    "/cart/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/profile/:path*",
    "/seller/:path*",
    "/admin/:path*",
  ],
};
