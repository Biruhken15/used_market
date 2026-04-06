import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IInvitation extends Document {
    storeId: mongoose.Types.ObjectId;
    email: string;
    role: 'manager';
    invitedBy: mongoose.Types.ObjectId;
    status: 'pending' | 'accepted' | 'declined';
    createdAt: Date;
}

const InvitationSchema = new Schema<IInvitation>({
    storeId: {
        type: Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    email: {
        type: String,
        required: true,
        index: true
    },
    role: {
        type: String,
        enum: ['manager'],
        default: 'manager'
    },
    invitedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 7 // 7 days expiry
    }
});

// Compound index for unique pending invites per store/email
InvitationSchema.index({ storeId: 1, email: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'pending' } });

const Invitation = models.Invitation || model<IInvitation>('Invitation', InvitationSchema);

export default Invitation;
