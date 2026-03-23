import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/utils/admin-auth';
import Store from '@/lib/models/store';
import User from '@/lib/models/user';

export async function GET(req: Request) {
    const { error } = await requireAdmin();
    if (error) return error;

    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const skip = (page - 1) * limit;

        // Fetch paginated stores and safely populate owner data
        const stores = await Store.find()
            .populate({ path: 'ownerId', select: 'name email role _id', model: User })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Store.countDocuments();

        return NextResponse.json({
            stores,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
