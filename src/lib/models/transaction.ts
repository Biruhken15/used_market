import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    storeId: mongoose.Types.ObjectId;
    subscriptionPlanId: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    paymentMethod: 'telebirr' | 'cbe_birr' | 'mpesa' | 'other';
    referenceId: string; // From the payment provider
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    billingCycle: 'monthly' | 'quarterly' | 'yearly';
    paymentDate?: Date;
    metadata?: Map<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    storeId: {
        type: Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    subscriptionPlanId: {
        type: Schema.Types.ObjectId,
        ref: 'SubscriptionPlan',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'ETB'
    },
    paymentMethod: {
        type: String,
        enum: ['telebirr', 'cbe_birr', 'mpesa', 'other'],
        required: true
    },
    referenceId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    billingCycle: {
        type: String,
        enum: ['monthly', 'quarterly', 'yearly'],
        required: true
    },
    paymentDate: {
        type: Date
    },
    metadata: {
        type: Map,
        of: Schema.Types.Mixed
    }
}, { timestamps: true });

// Create indexes for faster searches
// TransactionSchema.index({ referenceId: 1 }); // Removed duplicate (already defined as unique: true in schema)
TransactionSchema.index({ userId: 1 });
TransactionSchema.index({ storeId: 1 });
TransactionSchema.index({ status: 1 });

const Transaction = models.Transaction || model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
