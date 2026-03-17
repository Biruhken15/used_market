import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils/auth';
import { ProductService } from '@/lib/services/product-service';
import Product from '@/lib/models/product';
import dbConnect from '@/lib/db/mongoose';

/**
 * Handle individual product operations.
 */

// GET: Fetch product details
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const product = await Product.findById(params.id).populate('storeId');
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Role-based Sanitization
        const session = await getServerSession(authOptions);
        const isOwner = session?.user && (product.ownerId.toString() === (session.user as any).id);

        const productObj = product.toObject();
        if (!isOwner) {
            delete productObj.sourceOwner;
        }

        return NextResponse.json(productObj);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT: Update product details
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const updatedProduct = await ProductService.updateProduct(
            params.id,
            (session.user as any).id,
            data
        );

        return NextResponse.json(updatedProduct);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: Remove product listing
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await ProductService.deleteProduct(
            params.id,
            (session.user as any).id
        );

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
