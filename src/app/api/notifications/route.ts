import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils/auth';
import { NotificationService } from '@/lib/services/notification-service';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await NotificationService.getRecent((session.user as any).id);
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { notificationId, markAll } = await req.json();

        if (markAll) {
            await NotificationService.markAllAsRead((session.user as any).id);
        } else if (notificationId) {
            await NotificationService.markAsRead(notificationId);
        } else {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
