import { NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/services/analytics-service';

/**
 * API to track store and product engagement.
 */
export async function POST(req: Request) {
    try {
        const data = await req.json();

        if (!data.type || !data.targetId || !data.storeId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await AnalyticsService.trackEvent(data);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Tracking failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
