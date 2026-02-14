import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    return proxyRequest(request);
}

export async function POST(request: NextRequest) {
    return proxyRequest(request);
}

export async function PATCH(request: NextRequest) {
    return proxyRequest(request);
}

export async function DELETE(request: NextRequest) {
    return proxyRequest(request);
}

export async function PUT(request: NextRequest) {
    return proxyRequest(request);
}

async function proxyRequest(request: NextRequest) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/api/, ""); // Remove local /api prefix
    const searchParams = url.searchParams.toString();

    // Determine backend base URL
    const backendBaseUrl = (process.env.BACKEND_URL || "https://medquix-server.vercel.app").replace(/\/$/, "");
    const backendUrl = `${backendBaseUrl}/api${path}${searchParams ? `?${searchParams}` : ""}`;

    console.log(`Proxying ${request.method} ${url.pathname} -> ${backendUrl}`);

    // Filter and clone headers
    const headers = new Headers();
    const headersToSkip = ["host", "connection", "content-length"];
    request.headers.forEach((value, key) => {
        if (!headersToSkip.includes(key.toLowerCase())) {
            // Re-prefix cookies when forwarding to backend if they were de-prefixed correctly in browser
            // Better-auth production REQUIRES __Secure- prefix on HTTPS
            if (key.toLowerCase() === "cookie") {
                let newValue = value;
                if (!value.includes("__Secure-better-auth.session_token") && (backendUrl.startsWith("https") || url.hostname === "localhost")) {
                    newValue = value.replace(/better-auth\.session_token=/g, "__Secure-better-auth.session_token=");
                }
                headers.set(key, newValue);
            } else {
                headers.set(key, value);
            }
        }
    });

    // Add standard proxy headers
    headers.set("X-Forwarded-Host", url.host);
    headers.set("X-Forwarded-Proto", url.protocol.replace(":", ""));

    try {
        const res = await fetch(backendUrl, {
            method: request.method,
            headers: headers,
            body: ["POST", "PATCH", "PUT"].includes(request.method) ? await request.blob() : undefined,
            cache: "no-store",
            redirect: "manual"
        });

        const body = await res.blob();
        const responseHeaders = new Headers();

        // Handle all headers except Set-Cookie and decoding-related headers
        const headersToSkipResponse = ["set-cookie", "content-encoding", "content-length"];
        res.headers.forEach((value, key) => {
            if (!headersToSkipResponse.includes(key.toLowerCase())) {
                responseHeaders.set(key, value);
            }
        });

        // Specialized handling for Set-Cookie to ensure multiple cookies and attributes are handled
        // @ts-ignore - getSetCookie is available in modern runtimes like Vercel and Node 18+
        const setCookies = res.headers.getSetCookie?.() || res.headers.get("set-cookie")?.split(", ") || [];

        setCookies.forEach((cookie: string) => {
            let processedCookie = cookie
                .replace(/Domain=[^;]+;?\s*/gi, ""); // Remove Domain attribute

            // If on localhost (not on https), remove Secure and set SameSite to Lax
            // De-prefix __Secure- to allow browser to accept it on HTTP
            if (url.hostname === "localhost") {
                processedCookie = processedCookie
                    .replace(/;\s*Secure/gi, "")
                    .replace(/__Secure-better-auth\.session_token=/g, "better-auth.session_token=");

                if (processedCookie.toLowerCase().includes("samesite=none")) {
                    processedCookie = processedCookie.replace(/SameSite=None/gi, "SameSite=Lax");
                }
            }

            // Sync logging
            if (processedCookie.includes("better-auth.session_token")) {
                console.log("Renamed session token for browser:", processedCookie.split(';')[0]);
            }

            responseHeaders.append("Set-Cookie", processedCookie);
        });

        return new Response(body, {
            status: res.status,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error("Proxy error:", error);
        return new Response(JSON.stringify({ error: "API proxy error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
