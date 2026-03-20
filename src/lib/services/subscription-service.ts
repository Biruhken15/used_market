import dbConnect from '../db/mongoose';
import SubscriptionPlan from '../models/subscription-plan';
import UserSubscription from '../models/user-subscription';
import Store from '../models/store';
import { NotificationService } from './notification-service';

/**
 * Service to manage subscription plans and enforcement.
 * Follows a scalable pattern for business logic.
 */
export class SubscriptionService {

    /**
     * Seed default plans into the database based on requirements.
     */
    static async seedPlans() {
        await dbConnect();

        const plans = [
            {
                planCode: 'FREE_TRIAL',
                planName: 'Free Trial',
                price: 0,
                durationMonths: 1,
                limits: {
                    maxActiveListings: 50,
                    imagesPerProduct: 3,
                    featuredListingsPerMonth: 0,
                    listingDurationDays: 60,
                    maxStaffAccounts: 1
                },
                features: {
                    canMarkAsSold: false,
                    hasAnalytics: false,
                    analyticsLevel: 'none',
                    hasStoreBanner: true,
                    hasVerifiedBadge: false,
                    hasBulkUpload: false,
                    hasApiAccess: false,
                    hasPrioritySupport: false,
                    hasHomepagePromotion: false,
                    telegramEnabled: true,
                    phoneEnabled: true,
                    whatsappEnabled: false,
                    multipleLocations: false,
                    customBranding: false,
                    searchRankingBoost: 0,
                    canMarkAsUrgent: false
                },
                metadata: { colorTheme: 'emerald', tagline: 'Try before you buy' }
            },
            {
                planCode: 'BASIC_SELLER',
                planName: 'Basic Seller',
                price: 2999,
                durationMonths: 1,
                limits: {
                    maxActiveListings: 200,
                    imagesPerProduct: 5,
                    featuredListingsPerMonth: 0,
                    listingDurationDays: 60,
                    maxStaffAccounts: 2
                },
                features: {
                    canMarkAsSold: true,
                    hasAnalytics: true,
                    analyticsLevel: 'basic',
                    hasStoreBanner: true,
                    hasVerifiedBadge: false,
                    hasBulkUpload: false,
                    hasApiAccess: false,
                    hasPrioritySupport: false,
                    hasHomepagePromotion: false,
                    telegramEnabled: true,
                    phoneEnabled: true,
                    whatsappEnabled: false,
                    multipleLocations: false,
                    customBranding: false,
                    searchRankingBoost: 10,
                    canMarkAsUrgent: false
                },
                metadata: { colorTheme: 'blue', tagline: 'Perfect for starting out' }
            },
            {
                planCode: 'PRO_SELLER',
                planName: 'Pro Seller',
                price: 11999,
                durationMonths: 6,
                limits: {
                    maxActiveListings: 500,
                    imagesPerProduct: 5,
                    featuredListingsPerMonth: 5,
                    urgentDurationDays: 7,
                    listingDurationDays: 180,
                    maxStaffAccounts: 4
                },
                features: {
                    canMarkAsSold: true,
                    hasAnalytics: true,
                    analyticsLevel: 'advanced',
                    hasStoreBanner: true,
                    hasVerifiedBadge: true,
                    hasBulkUpload: true,
                    hasApiAccess: false,
                    hasPrioritySupport: false,
                    hasHomepagePromotion: false,
                    telegramEnabled: true,
                    phoneEnabled: true,
                    whatsappEnabled: true,
                    multipleLocations: true,
                    customBranding: false,
                    searchRankingBoost: 25,
                    canMarkAsUrgent: true
                },
                metadata: { colorTheme: 'purple', tagline: 'For serious sellers' }
            },
            {
                planCode: 'ENTERPRISE_SELLER',
                planName: 'Enterprise Account',
                price: 21999,
                durationMonths: 12,
                limits: {
                    maxActiveListings: 9999,
                    imagesPerProduct: 7,
                    featuredListingsPerMonth: 20,
                    urgentDurationDays: 15,
                    listingDurationDays: 365,
                    maxStaffAccounts: 5
                },
                features: {
                    canMarkAsSold: true,
                    hasAnalytics: true,
                    analyticsLevel: 'custom',
                    hasStoreBanner: true,
                    hasVerifiedBadge: true,
                    hasBulkUpload: true,
                    hasApiAccess: true,
                    hasPrioritySupport: true,
                    hasHomepagePromotion: true,
                    telegramEnabled: true,
                    phoneEnabled: true,
                    whatsappEnabled: true,
                    multipleLocations: true,
                    customBranding: true,
                    searchRankingBoost: 50,
                    canMarkAsUrgent: true
                },
                metadata: { colorTheme: 'slate', tagline: 'Market domination' }
            }
        ];

        for (const plan of plans) {
            console.log(`Syncing plan: ${plan.planCode} with price: ${plan.price}`);
            await SubscriptionPlan.findOneAndUpdate(
                { planCode: plan.planCode },
                { $set: plan },
                { upsert: true, new: true, runValidators: true }
            );
        }

        return { message: 'Subscription plans seeded successfully' };
    }

    /**
     * Automatically assign the Free Trial plan to a new store.
     */
    static async assignDefaultSubscription(userId: string, storeId: string) {
        await dbConnect();

        // Check if already has subscription
        const existing = await UserSubscription.findOne({ storeId });
        if (existing) return existing;

        const trialPlan = await SubscriptionPlan.findOne({ planCode: 'FREE_TRIAL' });
        if (!trialPlan) throw new Error("Free Trial plan not found in database. Please seed plans first.");

        return await UserSubscription.create({
            userId,
            storeId,
            planId: trialPlan._id,
            status: 'active',
            billingCycle: 'monthly',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days trial
        });
    }

    /**
     * Get all available subscription plans.
     */
    static async getPlans() {
        await dbConnect();
        return await SubscriptionPlan.find({}).sort({ 'price': 1 });
    }

    /**
     * Get a specific plan by ID or code.
     */
    static async getPlan(idOrCode: string) {
        await dbConnect();
        if (idOrCode.match(/^[0-9a-fA-F]{24}$/)) {
            return await SubscriptionPlan.findById(idOrCode);
        }
        return await SubscriptionPlan.findOne({ planCode: idOrCode });
    }

    /**
     * Get the active subscription for a store.
     */
    static async getStoreSubscription(storeId: string) {
        await dbConnect();
        return await UserSubscription.findOne({ storeId })
            .populate('planId')
            .exec();
    }

    /**
     * Check if a store can list a new product.
     */
    static async canAddProduct(storeId: string, currentActiveCount: number) {
        let subscription = await this.getStoreSubscription(storeId);

        // Auto-assign trial if missing (for legacy or missed creations)
        if (!subscription) {
            const store = await Store.findById(storeId);
            if (store) {
                subscription = await this.assignDefaultSubscription(store.ownerId.toString(), storeId);
                // Re-populate planId if just created
                subscription = await UserSubscription.findById(subscription._id).populate('planId').exec();
            }
        }

        if (!subscription || subscription.status !== 'active') {
            return { allowed: false, reason: 'No active subscription found' };
        }

        const plan = subscription.planId as any;
        if (currentActiveCount >= plan.limits.maxActiveListings) {
            return {
                allowed: false,
                reason: `Listing limit reached for ${plan.planName} plan (${plan.limits.maxActiveListings})`
            };
        }

        return { allowed: true };
    }

    /**
     * Check if image count is within plan limits.
     */
    static async validateImageCount(storeId: string, count: number) {
        const subscription = await this.getStoreSubscription(storeId);
        const plan = subscription?.planId as any;
        const limit = plan?.limits?.imagesPerProduct || 3;

        if (count > limit) {
            return { allowed: false, reason: `Plan limit exceeded. Your current plan allows only ${limit} images per listing.` };
        }
        return { allowed: true };
    }

    /**
     * Check for expired subscriptions and notify users.
     * This can be called on dashboard load.
     */
    static async checkSubscriptionExpiry(storeId: string) {
        const subscription = await this.getStoreSubscription(storeId);
        if (!subscription) return null;

        const now = new Date();
        const endDate = new Date(subscription.currentPeriodEnd);

        if (now > endDate && subscription.status !== 'expired') {
            // Update status to expired
            await UserSubscription.findByIdAndUpdate(subscription._id, { status: 'expired' });

            // Notify user
            await NotificationService.create({
                userId: subscription.userId.toString(),
                storeId: storeId,
                type: 'subscription_expired',
                title: 'Subscription Expired',
                message: `Your ${subscription.planId.planName} plan has expired. Please upgrade to continue selling.`,
                metadata: { planCode: subscription.planId.planCode }
            });

            return { expired: true, planName: subscription.planId.planName };
        }

        return { expired: now > endDate, planName: subscription.planId.planName };
    }
}
