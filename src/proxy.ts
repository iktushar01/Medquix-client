import { NextRequest, NextResponse } from "next/server";
import { userService } from "./services/user.service";
import { Roles } from "./constants/roles";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  let isAuthenticated = false;
  let isAdmin = false;
  let isSeller = false;
  let isUser = false;

  const { data } = await userService.getSession();

  if (data) {
    isAuthenticated = true;
    isAdmin = data.user.role === Roles.admin;
    isSeller = data.user.role === Roles.seller;
    isUser = data.user.role === Roles.user;
  }

  //* User in not authenticated at all
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  //* User is authenticated and role = USER
  //* User can not visit admin-dashboard
  if (!isAdmin && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!isSeller && pathname.startsWith("/seller")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!isUser && pathname.startsWith("/cart")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!isUser && pathname.startsWith("/orders")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/seller/:path*",
    "/user/:path*",
    "/cart/:path*",
    "/orders/:path*",
  ],
};