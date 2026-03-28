import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils/auth';
import connectDB from '@/lib/db/mongoose';
import Conversation from '@/lib/models/conversation';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: conversationId } = await params;
        await connectDB();

        const userId = (session.user as any).id;

        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: userId
        })
        .populate('participants', 'name email image')
        .populate('productId', 'title thumbnail price');

        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found or access denied' }, { status: 404 });
        }

        return NextResponse.json({ conversation });
    } catch (error: any) {
        console.error('Error fetching conversation details:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
