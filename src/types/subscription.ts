export type PlanCode = 'FREE_TRIAL' | 'BASIC_SELLER' | 'PRO_SELLER' | 'ENTERPRISE_SELLER';

export interface ISubscriptionPlan {
    _id: string;
    planCode: PlanCode;
    planName: string;
    limits: {
        maxActiveListings: number;
        imagesPerProduct: number;
        featuredListingsPerMonth: number;
        listingDurationDays: number;
        maxStaffAccounts: number;
    };
    features: {
        canMarkAsSold: boolean;
        hasAnalytics: boolean;
        analyticsLevel: 'none' | 'basic' | 'advanced' | 'custom';
        hasStoreBanner: boolean;
        hasVerifiedBadge: boolean;
        hasBulkUpload: boolean;
        hasApiAccess: boolean;
        hasPrioritySupport: boolean;
        hasHomepagePromotion: boolean;
        whatsappEnabled: boolean;
        telegramEnabled: boolean;
        phoneEnabled: boolean;
    };
}