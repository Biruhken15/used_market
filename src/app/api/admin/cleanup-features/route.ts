import { NextResponse } from 'next/server';
import cleanupUnauthorizedFeatures from '@/lib/scripts/cleanup-trial-features';

/**
 * Temp Admin Route to trigger the premium feature cleanup.
 * TO BE DELETED AFTER USE.
 */
export async function GET() {
    try {
        console.log('[Maintenance] Starting Premium Feature Cleanup...');
        // Note: In a real prod environment, we would add an API KEY check here.
        await cleanupUnauthorizedFeatures();
        return NextResponse.json({ success: true, message: 'Cleanup completed successfully.' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
