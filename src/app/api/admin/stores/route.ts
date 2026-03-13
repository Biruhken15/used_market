import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils/auth';
import { PlatformService } from '@/lib/services/platform-service';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const stores = await PlatformService.getAllStores();
        return NextResponse.json(stores);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
