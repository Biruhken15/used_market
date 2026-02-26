"use server";

import dbConnect from "@/lib/db/mongoose";
import SubscriptionPlan from "@/lib/models/subscription-plan";

/**
 * Run this once to initialize your 4 plans in the DB
 */
export async function seedSubscriptionPlans() {
    await dbConnect();

    const plans = [
        {
            planCode: 'FREE_TRIAL',
            planName: 'Free Trial',
            pricing: { monthly: 0 },
            limits: { maxActiveListings: 3, imagesPerProduct: 3, featuredListingsPerMonth: 0, listingDurationDays: 60, maxStaffAccounts: 1 },
            features: { telegramEnabled: true, phoneEnabled: true },
            metadata: { colorTheme: 'emerald', tagline: 'Try before you buy' }
        },
        {
            planCode: 'BASIC_SELLER',
            planName: 'Basic Seller',
            pricing: { monthly: 500 },
            limits: { maxActiveListings: 20, imagesPerProduct: 5, featuredListingsPerMonth: 0, listingDurationDays: 60, maxStaffAccounts: 2 },
            features: { hasAnalytics: true, analyticsLevel: 'basic', hasStoreBanner: true, telegramEnabled: true, phoneEnabled: true },
            metadata: { colorTheme: 'blue', tagline: 'Perfect for starting out' }
        },
        {
            planCode: 'PRO_SELLER',
            planName: 'Pro Seller',
            pricing: { monthly: 1300 }, // Monthly avg based on your requested cycle
            limits: { maxActiveListings: 100, imagesPerProduct: 10, featuredListingsPerMonth: 5, listingDurationDays: 90, maxStaffAccounts: 3 },
            features: { canMarkAsSold: true, hasAnalytics: true, analyticsLevel: 'advanced', hasStoreBanner: true, hasVerifiedBadge: true, hasBulkUpload: true, telegramEnabled: true, phoneEnabled: true, whatsappEnabled: true },
            metadata: { colorTheme: 'purple', tagline: 'For serious sellers' }
        },
        {
            planCode: 'ENTERPRISE_SELLER',
            planName: 'Enterprise Seller',
            pricing: { monthly: 2500 },
            limits: { maxActiveListings: -1, imagesPerProduct: 15, featuredListingsPerMonth: 20, listingDurationDays: -1, maxStaffAccounts: 5 },
            features: { canMarkAsSold: true, hasAnalytics: true, analyticsLevel: 'custom', hasStoreBanner: true, hasVerifiedBadge: true, hasBulkUpload: true, hasApiAccess: true, hasPrioritySupport: true, hasHomepagePromotion: true, telegramEnabled: true, phoneEnabled: true, whatsappEnabled: true },
            metadata: { colorTheme: 'gold', tagline: 'For high-volume businesses' }
        }
    ];

    for (const plan of plans) {
        await SubscriptionPlan.findOneAndUpdate({ planCode: plan.planCode }, plan, { upsert: true, new: true });
    }

    return { success: true, message: "Plans seeded successfully" };
}