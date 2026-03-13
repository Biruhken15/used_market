import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils/auth';
import dbConnect from '@/lib/db/mongoose';
import Favorite from '@/lib/models/favorite';
import mongoose from 'mongoose';

/**
 * POST /api/favorites/[id]
 * Toggles the favorite status for a given product ID for the logged-in user.
 */
export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const userId = (session.user as any).id;
        const { id: productId } = await params;

        if (!userId) {
            return NextResponse.json({ error: 'User ID not found in session' }, { status: 400 });
        }

        // Check if already favorited
        const existing = await Favorite.findOne({ userId, productId });

        if (existing) {
            await Favorite.deleteOne({ _id: existing._id });
            return NextResponse.json({ favorited: false, message: 'Removed from favorites' });
        } else {
            await Favorite.create({
                userId,
                productId,
                isRead: false // New favorite starts as unread for notifications
            });
            return NextResponse.json({ favorited: true, message: 'Added to favorites' });
        }
    } catch (error: any) {
        console.error('Favorite Toggle Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
