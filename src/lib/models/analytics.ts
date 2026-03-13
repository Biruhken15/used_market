import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IAnalytics extends Document {
    type: 'store_view' | 'product_view' | 'contact_click' | 'search_impression';
    targetId: mongoose.Types.ObjectId; // storeId or productId
    storeId: mongoose.Types.ObjectId; // Always link to store for easier aggregation
    viewerId?: string; // Session ID or User ID if logged in
    deviceType?: string;
    location?: {
        city?: string;
        region?: string;
    };
    timestamp: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>({
    type: {
        type: String,
        enum: ['store_view', 'product_view', 'contact_click', 'search_impression'],
        required: true
    },
    targetId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    storeId: {
        type: Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    viewerId: {
        type: String
    },
    deviceType: {
        type: String
    },
    location: {
        city: String,
        region: String
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Indexes for fast aggregation
AnalyticsSchema.index({ storeId: 1, type: 1, timestamp: -1 });
AnalyticsSchema.index({ targetId: 1, type: 1, timestamp: -1 });

const Analytics = models.Analytics || model<IAnalytics>('Analytics', AnalyticsSchema);

export default Analytics;
