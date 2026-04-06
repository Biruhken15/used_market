import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils/auth';
import dbConnect from '@/lib/db/mongoose';
import Invitation from '@/lib/models/invitation';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Find pending invitations for this user's email
        const invitations = await Invitation.find({
            email: session.user.email?.toLowerCase(),
            status: 'pending'
        }).populate({
            path: 'storeId',
            select: 'storeName storeSlug logo'
        }).populate({
            path: 'invitedBy',
            select: 'name'
        }).sort({ createdAt: -1 });

        return NextResponse.json({ invitations });
    } catch (error: any) {
        console.error('[Invitations API] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch invitations' }, { status: 500 });
    }
}
