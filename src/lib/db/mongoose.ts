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

let MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null, seeded: false };
}

async function connectDB() {
    MONGODB_URI = process.env.MONGODB_URI || MONGODB_URI;
    if (!MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 60000,
            family: 4
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then(async (mongooseInstance) => {
            console.log('=> MongoDB connected successfully');
            return mongooseInstance;
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
