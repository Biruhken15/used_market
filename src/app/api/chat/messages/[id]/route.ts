import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils/auth';
import connectDB from '@/lib/db/mongoose';
import Message from '@/lib/models/message';
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

        // Check if user is participant
        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: userId
        });

        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found or access denied' }, { status: 404 });
        }

        // Reset unread count for this user
        await Conversation.findByIdAndUpdate(conversationId, {
            $set: { [`unreadCount.${userId}`]: 0 }
        });

        // Fetch messages
        const messages = await Message.find({ conversationId })
            .sort({ createdAt: 1 });

        return NextResponse.json({ messages });
    } catch (error: any) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
