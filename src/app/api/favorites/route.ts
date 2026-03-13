import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils/auth';
import dbConnect from '@/lib/db/mongoose';
import Favorite from '@/lib/models/favorite';
import Product from '@/lib/models/product'; // Ensure model is registered

/**
 * GET /api/favorites
 * Returns all favorites for the logged-in user, populated with product data.
 * Also returns the unread count for the navbar badge.
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const userId = (session.user as any).id;

        if (!userId) {
            return NextResponse.json({ error: 'User ID not found in session' }, { status: 400 });
        }

        // Fetch favorites with populated products
        // Ensure Product model is registered
        const _ = Product;
        const favorites = await Favorite.find({ userId })
            .populate('productId')
            .sort({ createdAt: -1 });

        // Calculate unread count
        const unreadCount = await Favorite.countDocuments({ userId, isRead: false });

        return NextResponse.json({
            favorites,
            unreadCount
        });
    } catch (error: any) {
        console.error('Fetch Favorites Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * PATCH /api/favorites
 * Marks all favorites as 'read' so the notification badge clears.
 */
export async function PATCH() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const userId = (session.user as any).id;

        if (!userId) {
            return NextResponse.json({ error: 'User ID not found in session' }, { status: 400 });
        }

        await Favorite.updateMany({ userId, isRead: false }, { isRead: true });

        return NextResponse.json({ success: true, message: 'All favorites marked as read' });
    } catch (error: any) {
        console.error('Update Favorites Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
