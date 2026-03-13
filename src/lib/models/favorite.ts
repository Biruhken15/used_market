import mongoose, { Schema, Document } from 'mongoose';

export interface IFavorite extends Document {
    userId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    isRead: boolean;
    createdAt: Date;
}

const favoriteSchema = new Schema<IFavorite>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Ensure a user can only favorite a product once
favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', favoriteSchema);
