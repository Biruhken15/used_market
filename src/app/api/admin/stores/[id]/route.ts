import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/utils/admin-auth';
import Store from '@/lib/models/store';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireAdmin();
    if (error) return error;

    try {
        const resolvedParams = await params;
        const body = await req.json();
        
        const allowedUpdates: any = {};
        if (body.status && ['approved', 'rejected'].includes(body.status)) {
            allowedUpdates.status = body.status;
        }

        if (Object.keys(allowedUpdates).length === 0) {
            return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
        }

        const store = await Store.findByIdAndUpdate(resolvedParams.id, allowedUpdates, { new: true });
        if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

        return NextResponse.json(store);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireAdmin();
    if (error) return error;

    try {
        const resolvedParams = await params;
        const store = await Store.findByIdAndDelete(resolvedParams.id);
        if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

        // MVP: Hard deleting the store. Realistically cascade deletes on their products later.
        return NextResponse.json({ success: true, message: "Store hard deleted." });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
