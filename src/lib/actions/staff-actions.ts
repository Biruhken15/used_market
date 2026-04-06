"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/auth";
import { StoreService } from "../services/store-service";
import { revalidatePath } from "next/cache";
import dbConnect from "../db/mongoose";
import User from "../models/user";
import Store from "../models/store";

import Invitation from "../models/invitation";

export type ActionState = {
    success?: boolean;
    error?: string;
    details?: string;
};

/**
 * Action to invite a staff member to a store via email.
 * This creates a formal Invitation record that the user can accept.
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

        // 2. Check if already staff
        const isAlreadyStaff = store.staff.some((s: any) => s.email.toLowerCase() === email.toLowerCase());
        if (isAlreadyStaff) return { error: "User is already a staff member or pending." };

        // 3. Create or Update Invitation
        await Invitation.findOneAndUpdate(
            { storeId, email: email.toLowerCase() },
            { 
                invitedBy: session.user.id,
                status: 'pending',
                role: 'manager'
            },
            { upsert: true, new: true }
        );

        // Generate invitation link (redirects to platform)
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        const inviteLink = `${baseUrl}/auth/register?inviteEmail=${encodeURIComponent(email)}&storeId=${store._id}`;

        // SIMULATED EMAIL LOG
        console.log("\n--- PROFESSIONAL PROTOCOL EMAIL ---");
        console.log(`To: ${email}`);
        console.log(`Subject: [ACTION REQ] Invitation to manage ${store.storeName}`);
        console.log(`Link: ${inviteLink}`);
        console.log("-----------------------------------\n");

        revalidatePath("/seller/mystore");
        return { success: true };
    } catch (error: any) {
        console.error("[inviteStaffAction] Error:", error);
        return { error: "Failed to initialize invitation protocol.", details: error.message };
    }
}

/**
 * Action to accept a store invitation.
 */
export async function acceptInvitationAction(invitationId: string): Promise<ActionState> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) return { error: "Unauthorized" };

        await dbConnect();

        const invitation = await Invitation.findById(invitationId).populate('storeId');
        if (!invitation || invitation.status !== 'pending') {
            return { error: "Invitation not found or no longer valid." };
        }

        if (invitation.email.toLowerCase() !== session.user.email?.toLowerCase()) {
            return { error: "This invitation is not addressed to your identity." };
        }

        const store = await Store.findById(invitation.storeId);
        if (!store) return { error: "Store no longer exists." };

        // Add to staff
        store.staff.push({
            userId: session.user.id,
            email: session.user.email,
            role: invitation.role
        });

        invitation.status = 'accepted';
        await Promise.all([store.save(), invitation.save()]);

        revalidatePath("/profile");
        revalidatePath("/seller/mystore");
        
        return { success: true };
    } catch (error: any) {
        return { error: "Failed to accept protocol invitation." };
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
