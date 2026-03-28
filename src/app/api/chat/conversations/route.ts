import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils/auth';
import connectDB from '@/lib/db/mongoose';
import Conversation from '@/lib/models/conversation';
import User from '@/lib/models/user';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { recipientId, productId } = await req.json();
        if (!recipientId) {
            return NextResponse.json({ error: 'Recipient ID is required' }, { status: 400 });
        }

        await connectDB();

        const senderId = (session.user as any).id;
        if (senderId === recipientId) {
            return NextResponse.json({ error: 'Cannot start a conversation with yourself' }, { status: 400 });
        }

        // Check if conversation already exists
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] },
            productId: productId || null
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, recipientId],
                productId: productId || undefined,
            });
        }

        return NextResponse.json({ conversation });
    } catch (error: any) {
        console.error('Error starting conversation:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const userId = (session.user as any).id;
        const conversations = await Conversation.find({
            participants: userId
        })
        .populate('participants', 'name email image')
        .populate('productId', 'title thumbnail price')
        .populate('lastMessage')
        .sort({ updatedAt: -1 });

        return NextResponse.json({ conversations });
    } catch (error: any) {
        console.error('Error fetching conversations:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
