import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
    const path = req.nextUrl.pathname;

    const isPublicPath = path === "/auth/login" || path === "/auth/register" || path === "/";

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    if (isPublicPath && token) {
        if (path !== "/") {
            return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
        }
    }

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
    }

    // ADDED: Subscription Gating Logic
    if (token) {
        const planCode = (token as any).planCode;

        // Example: Only Pro/Enterprise can access Bulk Upload
        if (path.startsWith("/seller/bulk-upload")) {
            if (planCode !== "PRO_SELLER" && planCode !== "ENTERPRISE_SELLER") {
                return NextResponse.redirect(new URL("/pricing", req.nextUrl));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/auth/:path*",
        "/seller/:path*",
        "/profile/:path*",
    ],
};
