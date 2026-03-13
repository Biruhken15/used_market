import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils/auth';
import { ProductService } from '@/lib/services/product-service';
import Store from '@/lib/models/store';
import dbConnect from '@/lib/db/mongoose';

/**
 * API to list products (Marketplace) or create a new product.
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const city = searchParams.get('city');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const filters: any = {};
        if (category) filters.category = category;
        if (city) filters.city = city;

        const products = await ProductService.getMarketplaceProducts(filters, page, limit);
        return NextResponse.json(products);
    } catch (error: any) {
        console.error('Fetching products failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();

        await dbConnect();
        const store = await Store.findOne({ ownerId: (session.user as any).id });
        if (!store) {
            return NextResponse.json({ error: 'No store found. Create a store first.' }, { status: 404 });
        }

        const product = await ProductService.createProduct(
            (session.user as any).id,
            store._id.toString(),
            data
        );

        return NextResponse.json(product);
    } catch (error: any) {
        console.error('Product creation failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
