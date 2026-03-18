import mongoose from 'mongoose';
const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/used-store';

const subscriptionPlanSchema = new mongoose.Schema({
    planCode: { type: String, required: true, unique: true },
    planName: { type: String, required: true },
    price: { type: Number, required: true },
    durationMonths: { type: Number, required: true },
    limits: {
        maxActiveListings: { type: Number, required: true },
        imagesPerProduct: { type: Number, required: true },
        maxStaffAccounts: { type: Number, required: true },
        featuredListingsPerMonth: { type: Number, required: true },
        listingDurationDays: { type: Number, required: true }
    },
    features: {
        canMarkAsSold: { type: Boolean, default: false },
        hasAnalytics: { type: Boolean, default: false },
        analyticsLevel: { type: String, default: 'none' },
        hasStoreBanner: { type: Boolean, default: false },
        hasVerifiedBadge: { type: Boolean, default: false },
        hasBulkUpload: { type: Boolean, default: false },
        telegramEnabled: { type: Boolean, default: false },
        phoneEnabled: { type: Boolean, default: false },
        whatsappEnabled: { type: Boolean, default: false },
        searchRankingBoost: { type: Number, default: 0 },
        hasApiAccess: { type: Boolean, default: false },
        hasPrioritySupport: { type: Boolean, default: false },
        hasHomepagePromotion: { type: Boolean, default: false },
        multipleLocations: { type: Boolean, default: false },
        customBranding: { type: Boolean, default: false }
    },
    metadata: {
        colorTheme: { type: String, enum: ['emerald', 'blue', 'purple', 'gold', 'slate', 'orange'], default: 'emerald' },
        tagline: { type: String }
    }
});

async function forceSeed() {
    try {
        await mongoose.connect(dbUri);
        const SubscriptionPlan = mongoose.models.SubscriptionPlan || mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

        const payPerProductPlan = {
            planCode: 'PAY_PER_PRODUCT',
            planName: 'Single Item Boost (Urgent)',
            price: 499,
            durationMonths: 1,
            limits: {
                maxActiveListings: 1,
                imagesPerProduct: 10,
                featuredListingsPerMonth: 1,
                listingDurationDays: 30,
                maxStaffAccounts: 0
            },
            features: {
                canMarkAsSold: true,
                hasAnalytics: true,
                analyticsLevel: 'basic',
                hasStoreBanner: false,
                hasVerifiedBadge: true,
                hasBulkUpload: false,
                hasApiAccess: false,
                hasPrioritySupport: true,
                hasHomepagePromotion: true,
                whatsappEnabled: true,
                telegramEnabled: true,
                phoneEnabled: true,
                multipleLocations: false,
                customBranding: false,
                searchRankingBoost: 75
            },
            metadata: {
                colorTheme: 'orange',
                tagline: 'Sell it fast. Get it seen.'
            }
        };

        await SubscriptionPlan.findOneAndUpdate(
            { planCode: 'PAY_PER_PRODUCT' },
            payPerProductPlan,
            { upsert: true, new: true }
        );

        console.log('Successfully forced seed of PAY_PER_PRODUCT plan.');
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

forceSeed();
