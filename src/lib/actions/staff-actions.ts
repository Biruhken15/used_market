"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/auth";
import { StoreService } from "../services/store-service";
import { revalidatePath } from "next/cache";
import dbConnect from "../db/mongoose";
import User from "../models/user";
import Store from "../models/store";

export type ActionState = {
    success?: boolean;
    error?: string;
    details?: string;
};

/**
 * Action to invite a staff member to a store via email.
 * If the user is already registered, they are added directly.
 * If not, they are added to a "pending" list (or marked as editor by default).
 * Per user request: "all grant on the store no manager and editor roles".
 */
export async function inviteStaffAction(storeId: string, email: string): Promise<ActionState> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) return { error: "Unauthorized" };

        await dbConnect();

        // 1. Verify store ownership
        const store = await Store.findById(storeId);
        if (!store) return { error: "Store not found" };
        if (store.ownerId.toString() !== session.user.id) {
            return { error: "Only the store owner can invite staff." };
        }

        // 2. Check if user exists
        const invitedUser = await User.findOne({ email });

        if (invitedUser) {
            // Check if already staff
            const isAlreadyStaff = store.staff.some((s: any) => s.userId.toString() === invitedUser._id.toString());
            if (isAlreadyStaff) return { error: "User is already a staff member." };

            // Add as staff with "manager" level grants (no differentiation as requested)
            store.staff.push({
                userId: invitedUser._id,
                email: invitedUser.email,
                role: 'manager' // Granting "all" by default as requested
            });
            await store.save();
        } else {
            // Per requirement: "invited staff have to be register to the website if not registered"
            // Check if email already in pending/staff list
            const isEmailInStaff = store.staff.some((s: any) => s.email === email);
            if (isEmailInStaff) return { error: "An invitation has already been sent to this email." };

            store.staff.push({
                email: email,
                role: 'manager' // Unified role
            });
            await store.save();

            // Generate invitation link for new users
            const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
            const inviteLink = `${baseUrl}/auth/register?inviteEmail=${encodeURIComponent(email)}&storeId=${store._id}`;

            // SIMULATED EMAIL LOG
            console.log("\n--- SIMULATED PROTOCOL EMAIL ---");
            console.log(`To: ${email}`);
            console.log(`Subject: Invitation to join ${store.storeName} Staff`);
            console.log(`Message: You have been invited to manage ${store.storeName}.`);
            console.log(`Register here: ${inviteLink}`);
            console.log("-------------------------------\n");
        }

        revalidatePath("/seller/mystore");
        return { success: true };
    } catch (error: any) {
        console.error("[inviteStaffAction] Error:", error);
        return { error: "Failed to invite staff", details: error.message };
    }
}

/**
 * Action to remove a staff member by email or ID.
 */
export async function removeStaffAction(storeId: string, identifier: string): Promise<ActionState> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) return { error: "Unauthorized" };

        await dbConnect();

        const store = await Store.findById(storeId);
        if (!store) return { error: "Store not found" };
        if (store.ownerId.toString() !== session.user.id) {
            return { error: "Forbidden" };
        }

        store.staff = store.staff.filter((s: any) =>
            s.userId?.toString() !== identifier && s.email !== identifier
        );

        await store.save();
        revalidatePath("/seller/mystore");

        return { success: true };
    } catch (error: any) {
        return { error: "Failed to remove staff", details: error.message };
    }
}
