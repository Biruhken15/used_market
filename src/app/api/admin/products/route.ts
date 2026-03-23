import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/utils/admin-auth';
import Product from '@/lib/models/product';
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

        // Fetch paginated products and carefully populate their parent Store and Owner references
        const products = await Product.find()
            .populate({ path: 'ownerId', select: 'name email _id', model: User })
            .populate({ path: 'storeId', select: 'storeName _id storeType', model: Store })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Product.countDocuments();

        return NextResponse.json({
            products,
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
