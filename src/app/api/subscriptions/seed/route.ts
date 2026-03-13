import { NextResponse } from 'next/server';
import { SubscriptionService } from '@/lib/services/subscription-service';

/**
 * API to seed subscription plans.
 * In a real app, this would be protected for Admin only.
 */
export async function POST() {
    try {
        const result = await SubscriptionService.seedPlans();
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Seeding plans failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
