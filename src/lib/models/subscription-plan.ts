import mongoose from 'mongoose';

const subscriptionPlanSchema = new mongoose.Schema({
    planCode: {
        type: String,
        enum: ['FREE_TRIAL', 'BASIC_SELLER', 'PRO_SELLER', 'ENTERPRISE_SELLER'],
        required: true,
        unique: true
    },
    planName: { type: String, required: true },
    pricing: {
        monthly: { type: Number, required: true },
        quarterly: { type: Number },
        yearly: { type: Number }
    },
    limits: {
        maxActiveListings: { type: Number, required: true },
        imagesPerProduct: { type: Number, default: 3 },
        featuredListingsPerMonth: { type: Number, default: 0 },
        listingDurationDays: { type: Number, default: 60 },
        maxStaffAccounts: { type: Number, default: 1 }
    },
    features: {
        canMarkAsSold: { type: Boolean, default: false },
        hasAnalytics: { type: Boolean, default: false },
        analyticsLevel: { type: String, default: 'none' },
        hasStoreBanner: { type: Boolean, default: false },
        hasVerifiedBadge: { type: Boolean, default: false },
        hasBulkUpload: { type: Boolean, default: false },
        hasApiAccess: { type: Boolean, default: false },
        hasPrioritySupport: { type: Boolean, default: false },
        hasHomepagePromotion: { type: Boolean, default: false },
        whatsappEnabled: { type: Boolean, default: false },
        telegramEnabled: { type: Boolean, default: true },
        phoneEnabled: { type: Boolean, default: true }
    },
    metadata: {
        colorTheme: { type: String, default: 'blue' },
        tagline: { type: String }
    }
}, { timestamps: true });

export default mongoose.models.SubscriptionPlan || mongoose.model('SubscriptionPlan', subscriptionPlanSchema);