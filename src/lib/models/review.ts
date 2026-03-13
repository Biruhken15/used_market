import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    // The store being reviewed
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    // The user who wrote the review
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Rating out of 5
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    // Review comment
    comment: {
        type: String,
        required: true,
        trim: true
    },
    // For admin moderation if needed
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved'
    }
}, { timestamps: true });

// Ensure a user can only review a store once
reviewSchema.index({ storeId: 1, userId: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);
