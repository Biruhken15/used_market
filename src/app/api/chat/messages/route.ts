import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils/auth';
import connectDB from '@/lib/db/mongoose';
import Message from '@/lib/models/message';
import Conversation from '@/lib/models/conversation';
import pusher from '@/lib/pusher';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { conversationId, content } = await req.json();
        if (!conversationId || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectDB();

        const senderId = (session.user as any).id;

        // Check if conversation exists and user is a participant
        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: senderId
        });

        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found or access denied' }, { status: 404 });
        }

        // Create message
        const message = await Message.create({
            conversationId,
            senderId,
            content
        });

        // Update conversation with last message and increment unread for other participants
        const recipientId = conversation.participants.find((id: any) => id.toString() !== senderId.toString());
        
        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: message._id,
            $inc: { [`unreadCount.${recipientId}`]: 1 }
        });

        // Trigger Pusher event
        await pusher.trigger(`chat-${conversationId}`, 'new-message', message);
        
        // Also trigger a global notification for the recipient
        await pusher.trigger(`user-${recipientId}`, 'notification', {
            type: 'new_message',
            title: 'New Message',
            message: `You have a new message from ${session.user.name}`,
            metadata: { conversationId, senderId }
        });

        return NextResponse.json({ message });
    } catch (error: any) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
