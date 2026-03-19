import { NextResponse } from 'next/server';
import { SeedService } from '@/lib/services/seed-service';

export async function POST() {
    try {
        const result = await SeedService.seedAll();
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('[Seed Error]:', error);
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}
