import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
    const path = req.nextUrl.pathname;

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });
    
    // Paths targeted by this middleware are ALWAYS private (see config.matcher)
    if (!token) {
        const loginUrl = new URL("/auth/login", req.nextUrl);
        loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    // ADDED: Subscription Gating Logic
    if (token) {
        /* 
        const planCode = (token as any).planCode;

        // Example: Only Pro/Enterprise can access Bulk Upload
        if (path.startsWith("/seller/bulk-upload")) {
            if (planCode !== "PRO_SELLER" && planCode !== "ENTERPRISE_SELLER") {
                return NextResponse.redirect(new URL("/pricing", req.nextUrl));
            }
        }
        */
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/seller/:path*",
        "/profile/:path*",
        "/favorites",
        "/chat",
        "/notifications",
    ],
};
