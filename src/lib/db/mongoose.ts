import mongoose from 'mongoose';

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
            maxPoolSize: 100, // Handle high concurrency for 1M+ users
            connectTimeoutMS: 10000, // 10s timeout
            socketTimeoutMS: 45000, // 45s socket timeout
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
