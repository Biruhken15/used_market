import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/utils/admin-auth';
import User from '@/lib/models/user';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireAdmin();
    if (error) return error;

    try {
        const resolvedParams = await params;
        const body = await req.json();
        
        // Allowed fields strictly filtered
        const allowedUpdates: any = {};
        if (body.role && ['user', 'admin'].includes(body.role)) allowedUpdates.role = body.role;
        if (body.name) allowedUpdates.name = body.name;

        if (Object.keys(allowedUpdates).length === 0) {
            return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
        }

        const user = await User.findByIdAndUpdate(resolvedParams.id, allowedUpdates, { new: true }).select('-password');
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        return NextResponse.json(user);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireAdmin();
    if (error) return error;

    try {
        const resolvedParams = await params;
        const user = await User.findByIdAndDelete(resolvedParams.id);
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Note: Realistically in a robust system, you'd soft-delete or orchestrate cascading deletes for their products/stores here.
        // For MVP, deleting the User directly.
        return NextResponse.json({ success: true, message: "User hard deleted." });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
