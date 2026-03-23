import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/utils/admin-auth';
import Product from '@/lib/models/product';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireAdmin();
    if (error) return error;

    try {
        const resolvedParams = await params;
        const body = await req.json();
        
        const allowedUpdates: any = {};
        
        // Admins might forcibly mark spam or incorrectly categorized items as sold/archived
        if (body.status && ['active', 'sold', 'archived'].includes(body.status)) {
            allowedUpdates.status = body.status;
        }

        if (Object.keys(allowedUpdates).length === 0) {
            return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
        }

        const product = await Product.findByIdAndUpdate(resolvedParams.id, allowedUpdates, { new: true });
        if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

        return NextResponse.json(product);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireAdmin();
    if (error) return error;

    try {
        const resolvedParams = await params;
        const product = await Product.findByIdAndDelete(resolvedParams.id);
        if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

        // MVP: Hard deleting the product. Image cleanup from Cloudinary is skipped for speed.
        return NextResponse.json({ success: true, message: "Product permanently removed." });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
