import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Define protected routes and their required roles
    const protectedRoutes = [
        { path: "/admin", roles: ["admin"] },
        { path: "/seller", roles: ["seller"] },
        { path: "/profile", roles: ["seller", "admin", "user"] },
        { path: "/orders", roles: ["seller", "admin", "user"] },
        { path: "/cart", roles: ["seller", "admin", "user"] },
        { path: "/checkout", roles: ["seller", "admin", "user"] },
    ];

    const currentRoute = protectedRoutes.find(route => pathname.startsWith(route.path));

    if (!currentRoute) {
        return NextResponse.next();
    }

    // Get session from backend
    const backendBaseUrl = (process.env.BACKEND_URL || "https://medquix-server.vercel.app").replace(/\/$/, "");
    const sessionUrl = `${backendBaseUrl}/api/auth/get-session`;

    // Robust cookie re-prefixing for backend
    // In production (HTTPS), better-auth REQUIRES __Secure- prefix
    let cookie = request.headers.get("cookie") || "";
    if (cookie && !cookie.includes("__Secure-better-auth.session_token") && (backendBaseUrl.startsWith("https") || request.nextUrl.hostname === "localhost")) {
        cookie = cookie.replace(/better-auth\.session_token=/g, "__Secure-better-auth.session_token=");
        console.log(`Middleware: Reprefixed cookie for backend ${backendBaseUrl}`);
    }

    try {
        const res = await fetch(sessionUrl, {
            headers: {
                cookie,
                "User-Agent": request.headers.get("User-Agent") || "",
                "Origin": request.headers.get("Origin") || "",
                "Referer": request.headers.get("Referer") || "",
                "X-Forwarded-Host": request.nextUrl.host,
                "X-Forwarded-Proto": request.nextUrl.protocol.replace(":", ""),
                "X-Forwarded-For": request.headers.get("x-forwarded-for") || "127.0.0.1",
            },
            cache: "no-store",
        });

        const sessionData = await res.json();
        const session = sessionData?.data || sessionData;
        const user = session?.user;
        const role = user?.role;

        // 1. Not logged in
        if (!user) {
            console.log(`Middleware: Session verification failed for ${pathname} (User: ${!!user}), redirecting to /login`);
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // 2. Logged in but wrong role
        if (!currentRoute.roles.includes(role)) {
            console.log(`Middleware: Role '${role}' unauthorized for ${pathname}, redirecting to /`);
            return NextResponse.redirect(new URL("/", request.url));
        }

        // 3. Authorized
        return NextResponse.next();
    } catch (error) {
        console.error("Middleware session check failed:", error);
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
