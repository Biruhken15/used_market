import dbConnect from "@/lib/db/mongoose";
import UserSubscription from "@/lib/models/user-subscription";
import SubscriptionPlan from "@/lib/models/subscription-plan";
import Product from "@/lib/models/product";
import { ISubscriptionPlan } from "@/types/subscription";

export class SubscriptionService {
    /**
     * Retrieves active plan for a Store Owner
     */
    static async getOwnerPlan(userId: string): Promise<ISubscriptionPlan | null> {
        await dbConnect();
        const sub = await UserSubscription.findOne({ userId, status: 'active' }).populate('planId');
        return sub ? (sub.planId as unknown as ISubscriptionPlan) : null;
    }

    /**
     * Checks if the store owner can add more products based on their tier
     */
    static async canAddListing(userId: string): Promise<{ allowed: boolean; limit: number; current: number }> {
        const plan = await this.getOwnerPlan(userId);
        const currentCount = await Product.countDocuments({ sellerId: userId });

        // Default guest limits if no plan exists
        if (!plan) return { allowed: currentCount < 3, limit: 3, current: currentCount };

        if (plan.limits.maxActiveListings === -1) {
            return { allowed: true, limit: Infinity, current: currentCount };
        }

        return {
            allowed: currentCount < plan.limits.maxActiveListings,
            limit: plan.limits.maxActiveListings,
            current: currentCount
        };
    }

    /**
     * Generic check for feature access
     */
    static async hasFeature(userId: string, featureKey: keyof ISubscriptionPlan['features']): Promise<boolean> {
        const plan = await this.getOwnerPlan(userId);
        return !!plan?.features[featureKey];
    }
}