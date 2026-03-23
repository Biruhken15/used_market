import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { NextResponse } from "next/server";
import dbConnect from "../db/mongoose";

/**
 * Ensures strict admin-only execution for API routes.
 * Call this at the VERY TOP of any /api/admin/* route.
 */
export async function requireAdmin() {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), session: null };
    }

    if ((session.user as any).role !== "admin") {
        return { error: NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 }), session: null };
    }

    return { error: null, session };
}
