"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/auth";
import { revalidatePath } from "next/cache";
import dbConnect from "../db/mongoose";
import UserSubscription from "../models/user-subscription";
import { NotificationService } from "../services/notification-service";

export type ActionState = {
    success?: boolean;
    error?: string;
    details?: string;
};

/**
 * Action to cancel a subscription.
 * In this implementation, we set the status to 'canceled'.
 * The user still has access until the end of the period (currentPeriodEnd).
 */
export async function cancelSubscriptionAction(storeId: string): Promise<ActionState> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) return { error: "Unauthorized" };

        await dbConnect();

        const subscription = await UserSubscription.findOne({ storeId });
        if (!subscription) return { error: "No active subscription found." };

        if (subscription.userId.toString() !== session.user.id) {
            return { error: "Unauthorized. You are not the owner of this subscription." };
        }

        subscription.status = 'canceled'; // Marks for non-renewal
        await subscription.save();

        await NotificationService.create({
            userId: session.user.id,
            storeId: storeId,
            type: 'subscription_canceled',
            title: 'Subscription Canceled',
            message: 'Your subscription has been set to cancel at the end of the current billing period.',
            metadata: { currentPeriodEnd: subscription.currentPeriodEnd }
        });

        revalidatePath("/seller/mystore");
        revalidatePath("/seller/checkout");

        return { success: true };
    } catch (error: any) {
        return { error: "Cancellation Failed", details: error.message };
    }
}