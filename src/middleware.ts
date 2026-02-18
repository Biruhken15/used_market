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
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/auth/:path*",
    ],
};
