import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils/auth';
import { ProductService } from '@/lib/services/product-service';
import Store from '@/lib/models/store';
import dbConnect from '@/lib/db/mongoose';

/**
 * API to mark a product as sold.
 */
export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const productId = params.id;
        if (!productId) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
        }

        await dbConnect();
        const store = await Store.findOne({ ownerId: (session.user as any).id });
        if (!store) {
            return NextResponse.json({ error: 'No store found' }, { status: 404 });
        }

        const product = await ProductService.markAsSold(productId, store._id.toString());

        return NextResponse.json(product);
    } catch (error: any) {
        console.error('Marking as sold failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
