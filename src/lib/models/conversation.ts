import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IConversation extends Document {
    participants: mongoose.Types.ObjectId[];
    productId?: mongoose.Types.ObjectId;
    lastMessage?: mongoose.Types.ObjectId;
    unreadCount: Map<string, number>; // userId -> count
    createdAt: Date;
    updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: false
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
        required: false
    },
    unreadCount: {
        type: Map,
        of: Number,
        default: {}
    }
}, { timestamps: true });

// Index for finding conversations for a user
conversationSchema.index({ participants: 1 });
// Index for finding conversation between specific users for a product
conversationSchema.index({ participants: 1, productId: 1 });

const Conversation: Model<IConversation> = mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', conversationSchema);

export default Conversation;
