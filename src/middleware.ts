import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const roleLinks: Record<string, string> = {
    admin: "/admin/dashboard",
    seller: "/seller/dashboard",
    user: "/",
    customer: "/",
};

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const localAppUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

    // 1. Get Session from the proxy endpoint
    try {
        const cookieHeader = request.headers.get("cookie") || "";
        const res = await fetch(`${localAppUrl}/api/auth/get-session`, {
            headers: {
                cookie: cookieHeader,
            },
            cache: "no-store",
        });

        const session = await res.json();
        const user = session?.user;

        // If not logged in and trying to access matcher-protected routes
        if (!user) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        const role = user.role as keyof typeof roleLinks;
        const redirectPath = roleLinks[role];

        if (!redirectPath) return NextResponse.next();

        // --- Role-based Redirection Logic ---

        // Customer (user/customer) trying to access Admin or Seller routes
        if ((role === "user" || role === "customer") && (pathname.startsWith("/admin") || pathname.startsWith("/seller"))) {
            return NextResponse.redirect(new URL(roleLinks[role], request.url));
        }

        // Seller trying to access Admin or Customer-specific routes
        if (role === "seller" && (pathname.startsWith("/admin") || pathname.startsWith("/profile") || pathname.startsWith("/orders") || pathname.startsWith("/cart") || pathname.startsWith("/checkout"))) {
            return NextResponse.redirect(new URL(redirectPath, request.url));
        }

        // Admin trying to access Seller or Customer-specific routes
        if (role === "admin" && (pathname.startsWith("/seller") || pathname.startsWith("/profile") || pathname.startsWith("/orders") || pathname.startsWith("/cart") || pathname.startsWith("/checkout"))) {
            return NextResponse.redirect(new URL(redirectPath, request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Middleware Auth Error:", error);
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/seller/:path*",
        "/profile/:path*",
        "/orders/:path*",
        "/cart/:path*",
        "/checkout/:path*",
    ],
};
