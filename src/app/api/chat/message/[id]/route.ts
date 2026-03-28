import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils/auth';
import connectDB from '@/lib/db/mongoose';
import Message from '@/lib/models/message';
import pusher from '@/lib/pusher';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: messageId } = await params;
        const { content } = await req.json();

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        await connectDB();
        const userId = (session.user as any).id;

        const message = await Message.findById(messageId);
        if (!message) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }

        if (message.senderId.toString() !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        message.content = content;
        message.isEdited = true;
        await message.save();

        // Trigger Pusher event
        await pusher.trigger(`chat-${message.conversationId}`, 'message-updated', {
            _id: message._id,
            content: message.content,
            isEdited: true
        });

        return NextResponse.json({ message });
    } catch (error: any) {
        console.error('Error updating message:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: messageId } = await params;
        await connectDB();
        const userId = (session.user as any).id;

        const message = await Message.findById(messageId);
        if (!message) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }

        if (message.senderId.toString() !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Soft delete
        message.isDeleted = true;
        message.content = 'This message was deleted';
        await message.save();

        // Trigger Pusher event
        await pusher.trigger(`chat-${message.conversationId}`, 'message-deleted', {
            _id: message._id
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting message:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
