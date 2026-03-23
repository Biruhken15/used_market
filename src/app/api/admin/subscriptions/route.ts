import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/utils/admin-auth';
import UserSubscription from '@/lib/models/user-subscription';
import SubscriptionPlan from '@/lib/models/subscription-plan';
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

        const subscriptions = await UserSubscription.find()
            .populate({ path: 'userId', select: 'name email', model: User })
            .populate({ path: 'storeId', select: 'storeName storeType', model: Store })
            .populate({ path: 'planId', select: 'planName planCode price', model: SubscriptionPlan })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await UserSubscription.countDocuments();

        return NextResponse.json({
            subscriptions,
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
