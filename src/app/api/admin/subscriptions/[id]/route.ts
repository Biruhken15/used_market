import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/utils/admin-auth';
import UserSubscription from '@/lib/models/user-subscription';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireAdmin();
    if (error) return error;

    try {
        const resolvedParams = await params;
        const body = await req.json();
        
        const allowedUpdates: any = {};
        if (body.status && ['active', 'past_due', 'canceled', 'expired'].includes(body.status)) {
            allowedUpdates.status = body.status;
        }

        if (Object.keys(allowedUpdates).length === 0) {
            return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
        }

        const subscription = await UserSubscription.findByIdAndUpdate(resolvedParams.id, allowedUpdates, { new: true });
        if (!subscription) return NextResponse.json({ error: "Subscription not found" }, { status: 404 });

        return NextResponse.json(subscription);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireAdmin();
    if (error) return error;

    try {
        const resolvedParams = await params;
        // Hard delete is risky for billing records, but allowed for MVP admin panel
        const subscription = await UserSubscription.findByIdAndDelete(resolvedParams.id);
        if (!subscription) return NextResponse.json({ error: "Subscription not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Subscription record fully expunged." });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
