import { NextResponse } from 'next/server';
import { SubscriptionService } from '@/lib/services/subscription-service';

export async function POST() {
    try {
        console.log('=> Starting manual subscription plans seeding...');
        const result = await SubscriptionService.seedPlans();
        console.log('=> Manual seeding successful');
        
        return NextResponse.json({
            success: true,
            message: result.message,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('=> Manual seeding failed:', error.message);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ message: "Use POST to trigger seeding" });
}
