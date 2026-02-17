import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) { return proxyRequest(request); }
export async function POST(request: NextRequest) { return proxyRequest(request); }
export async function PATCH(request: NextRequest) { return proxyRequest(request); }
export async function DELETE(request: NextRequest) { return proxyRequest(request); }
export async function PUT(request: NextRequest) { return proxyRequest(request); }

async function proxyRequest(request: NextRequest) {
    const url = new URL(request.url);
    // Remove local /api prefix to get the actual backend path
    const path = url.pathname.replace(/^\/api/, ""); 
    const searchParams = url.searchParams.toString();

    const backendBaseUrl = (process.env.BACKEND_URL || "https://medquix-server.vercel.app").replace(/\/$/, "");
    const backendUrl = `${backendBaseUrl}/api${path}${searchParams ? `?${searchParams}` : ""}`;

    console.log(`Proxying ${request.method} ${url.pathname} -> ${backendUrl}`);

    // Filter and clone headers
    const headers = new Headers();
    const headersToSkip = ["host", "connection", "content-length"];
    
    request.headers.forEach((value, key) => {
        if (!headersToSkip.includes(key.toLowerCase())) {
            if (key.toLowerCase() === "cookie") {
                let newValue = value;
                // Better-auth production REQUIRES __Secure- prefix on HTTPS
                if (!value.includes("__Secure-better-auth.session_token") && (backendUrl.startsWith("https") || url.hostname === "localhost")) {
                    newValue = value.replace(/better-auth\.session_token=/g, "__Secure-better-auth.session_token=");
                }
                headers.set(key, newValue);
            } else {
                headers.set(key, value);
            }
        }
    });

    headers.set("X-Forwarded-Host", url.host);
    headers.set("X-Forwarded-Proto", url.protocol.replace(":", ""));

    try {
        // Prepare fetch options
        const fetchOptions: RequestInit = {
            method: request.method,
            headers: headers,
            cache: "no-store",
            redirect: "manual"
        };

        // Only attach body for methods that typically have one
        if (["POST", "PATCH", "PUT"].includes(request.method)) {
            const contentType = request.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
                fetchOptions.body = JSON.stringify(await request.json());
            } else {
                fetchOptions.body = await request.blob();
            }
        }

        const res = await fetch(backendUrl, fetchOptions);
        const responseHeaders = new Headers();

        // Skip headers that should be handled by the proxy or the browser
        const headersToSkipResponse = ["set-cookie", "content-encoding", "content-length"];
        res.headers.forEach((value, key) => {
            if (!headersToSkipResponse.includes(key.toLowerCase())) {
                responseHeaders.set(key, value);
            }
        });

        // Handle Set-Cookie
        // @ts-ignore
        const setCookies = res.headers.getSetCookie?.() || [];

        setCookies.forEach((cookie: string) => {
            let processedCookie = cookie.replace(/Domain=[^;]+;?\s*/gi, "");

            if (url.hostname === "localhost") {
                processedCookie = processedCookie
                    .replace(/;\s*Secure/gi, "")
                    .replace(/__Secure-better-auth\.session_token=/g, "better-auth.session_token=");

                if (processedCookie.toLowerCase().includes("samesite=none")) {
                    processedCookie = processedCookie.replace(/SameSite=None/gi, "SameSite=Lax");
                }
            }
            responseHeaders.append("Set-Cookie", processedCookie);
        });

        // Get body as blob to handle both text and binary (images, etc)
        const responseBody = await res.blob();

        return new Response(responseBody, {
            status: res.status,
            headers: responseHeaders,
        });

    } catch (error) {
        console.error("Proxy error:", error);
        return new Response(JSON.stringify({ error: "API proxy error", message: error instanceof Error ? error.message : String(error) }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}