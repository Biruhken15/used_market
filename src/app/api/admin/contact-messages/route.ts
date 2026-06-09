import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/utils/admin-auth';
import ContactMessage from '@/lib/models/contact-message';

export async function GET(req: Request) {
    const { error } = await requireAdmin();
    if (error) return error;

    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const skip = (page - 1) * limit;

        const [messages, total] = await Promise.all([
            ContactMessage.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            ContactMessage.countDocuments()
        ]);

        return NextResponse.json({
            messages,
            pagination: {
                total,
                page,
                limit,
                pages: Math.max(1, Math.ceil(total / limit))
            }
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
