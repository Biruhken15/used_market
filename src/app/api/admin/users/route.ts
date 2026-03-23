import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/utils/admin-auth';
import User from '@/lib/models/user';
import Store from '@/lib/models/store';

export async function GET(req: Request) {
    const { error } = await requireAdmin();
    if (error) return error;

    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const skip = (page - 1) * limit;

        // Fetch paginated users, excluding passwords
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await User.countDocuments();

        // Check if any of these users own stores
        const enhancedUsers = await Promise.all(users.map(async (u: any) => {
        const store = await Store.findOne({ ownerId: u._id }).select('storeName').lean();
            return {
                ...u,
                storeName: (store as any)?.storeName || null
            };
        }));

        return NextResponse.json({
            users: enhancedUsers,
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
