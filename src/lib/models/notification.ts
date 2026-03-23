import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: false // Optional, can be personal notification
    },
    type: {
        type: String,
        enum: [
            'subscription_expired', 
            'limit_reached', 
            'payment_success', 
            'system_alert', 
            'new_feature', 
            'subscription_canceled',
            'product_favorited',
            'product_shared',
            'product_viewed',
            'store_visited',
            'new_message',
            'price_drop'
        ],
        required: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    metadata: {
        planCode: String,
        txRef: String,
        limitType: String // e.g., 'products', 'images'
    }
}, { timestamps: true });

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ type: 1 });

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
