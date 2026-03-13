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
            // We can pre-add them to the staff list with just email, and when they register, 
            // a hook or logic during registration should link them.

            // Check if email already in pending/staff list
            const isEmailInStaff = store.staff.some((s: any) => s.email === email);
            if (isEmailInStaff) return { error: "An invitation has already been sent to this email." };

            store.staff.push({
                email: email,
                role: 'manager' // Unified role
            });
            await store.save();

            // TODO: In a real app, send actual email here.
            console.log(`[Staff Invitation] Email sent to ${email} for store ${store.storeName}`);
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
