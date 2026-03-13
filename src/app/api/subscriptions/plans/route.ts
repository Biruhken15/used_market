import { NextResponse } from 'next/server';
import { SubscriptionService } from '@/lib/services/subscription-service';

export const dynamic = 'force-dynamic';

/**
 * API to fetch all available subscription plans.
 */
export async function GET() {
    try {
        const plans = await SubscriptionService.getPlans();
        return NextResponse.json(plans);
    } catch (error: any) {
        console.error('Fetching plans failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
