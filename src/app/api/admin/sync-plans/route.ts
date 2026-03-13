import { NextResponse } from 'next/server';
import { SubscriptionService } from '@/lib/services/subscription-service';

/**
 * Temporary admin utility to sync subscription plans with the latest code definition.
 * Should be removed or protected in production.
 */
export async function GET() {
    try {
        await SubscriptionService.seedPlans();
        const updatedPlans = await SubscriptionService.getPlans();
        return NextResponse.json({
            success: true,
            message: 'Subscription plans synchronized successfully',
            plans: updatedPlans
        });
    } catch (error: any) {
        console.error('Sync failed:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
