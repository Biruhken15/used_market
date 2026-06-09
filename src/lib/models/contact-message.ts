import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContactMessage extends Document {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    label: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const contactMessageSchema = new Schema<IContactMessage>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true,
        default: ''
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    label: {
        type: String,
        default: 'New'
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

contactMessageSchema.index({ email: 1, createdAt: -1 });

const ContactMessage: Model<IContactMessage> = mongoose.models.ContactMessage || mongoose.model<IContactMessage>('ContactMessage', contactMessageSchema);

export default ContactMessage;
