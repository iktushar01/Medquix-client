import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Define protected routes and their required roles
    const protectedRoutes = [
        { path: "/admin", roles: ["admin"] },
        { path: "/seller", roles: ["seller"] },
        { path: "/profile", roles: [ "seller", "admin", "user"] },
        { path: "/orders", roles: ["seller", "admin", "user"] },
        { path: "/cart", roles: [ "seller", "admin", "user"] },
        { path: "/checkout", roles: [ "seller", "admin", "user"] },
    ];

    const currentRoute = protectedRoutes.find(route => pathname.startsWith(route.path));

    if (!currentRoute) {
        return NextResponse.next();
    }

    // Get session from backend
    const backendBaseUrl = (process.env.BACKEND_URL || "https://medquix-server.vercel.app").replace(/\/$/, "");
    const sessionUrl = `${backendBaseUrl}/api/auth/get-session`;

    // Cookie re-prefixing for backend
    let cookie = request.headers.get("cookie") || "";
    if (request.nextUrl.hostname === "localhost") {
        cookie = cookie.replace(/better-auth\.session_token=/g, "__Secure-better-auth.session_token=");
    }

    try {
        const res = await fetch(sessionUrl, {
            headers: { cookie },
            cache: "no-store",
        });

        const sessionData = await res.json();
        const session = sessionData?.data || sessionData;
        const user = session?.user;
        const role = user?.role;

        // 1. Not logged in
        if (!user) {
            console.log(`Middleware: No session for ${pathname}, redirecting to /login`);
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // 2. Logged in but wrong role
        if (!currentRoute.roles.includes(role)) {
            console.log(`Middleware: Role ${role} unauthorized for ${pathname}, redirecting to /`);
            return NextResponse.redirect(new URL("/", request.url));
        }

        // 3. Authorized
        return NextResponse.next();
    } catch (error) {
        console.error("Middleware session check failed:", error);
        // On error, let the request through or redirect to login? 
        // Usually safer to redirect to login if we can't verify session on protected routes
        return NextResponse.redirect(new URL("/login", request.url));
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
