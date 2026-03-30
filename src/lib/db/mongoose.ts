import mongoose from 'mongoose';
// Ensure all models are registered
import '@/lib/models/user';
import '@/lib/models/product';
import '@/lib/models/store';
import '@/lib/models/message';
import '@/lib/models/conversation';
import '@/lib/models/notification';
import '@/lib/models/favorite';
import '@/lib/models/subscription-plan';
import '@/lib/models/user-subscription';
import '@/lib/models/transaction';
import '@/lib/models/review';
import '@/lib/models/analytics';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10, // Reduced for stability
            connectTimeoutMS: 30000, // 30s timeout
            socketTimeoutMS: 60000, // 60s socket timeout
            family: 4 // Use IPv4
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            console.log('=> MongoDB connected successfully (Pool: 100)');
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e: any) {
        console.error('=> MongoDB connection failed:', e.message);
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDB;
