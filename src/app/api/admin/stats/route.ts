import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils/auth';
import { PlatformService } from '@/lib/services/platform-service';

/**
 * API to fetch global platform statistics (Admin Only).
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
        }

        const stats = await PlatformService.getGlobalStats();
        return NextResponse.json(stats);
    } catch (error: any) {
        console.error('Fetching platform stats failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
