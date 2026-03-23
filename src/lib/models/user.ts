import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [4, 'Password must be at least 4 characters'],
        select: false, // Don't return password by default
    },
    role: {
        type: String,
        enum: ['user', 'seller', 'admin'],
        default: 'user',
    },
}, { timestamps: true });

UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

const User = models.User || model('User', UserSchema);

export default User;
