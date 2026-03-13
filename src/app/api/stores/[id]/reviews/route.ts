import { NextResponse } from 'next/server';
import Review from '@/lib/models/review';
import dbConnect from '@/lib/db/mongoose';
import User from '@/lib/models/user';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const reviews = await Review.find({ storeId: params.id })
            .populate('userId', 'name')
            .sort({ createdAt: -1 });

        return NextResponse.json(reviews);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
