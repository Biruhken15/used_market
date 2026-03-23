import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils/auth';
import { ProductService } from '@/lib/services/product-service';
import Store from '@/lib/models/store';
import dbConnect from '@/lib/db/mongoose';

import { handleApiError } from '@/lib/utils/api-error';

import { rateLimit } from '@/lib/utils/rate-limiter';

/**
 * API to list products (Marketplace) or create a new product.
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const city = searchParams.get('city');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12'); // Optimized limit

        const filters: any = {};
        if (category) filters.category = category;
        if (city) filters.city = city;

        const products = await ProductService.getMarketplaceProducts(filters, page, limit);
        return NextResponse.json(products);
    } catch (error: any) {
        return handleApiError(error);
    }
}

export async function POST(req: Request) {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const limiter = rateLimit(ip, 5, 60000); // 5 product creations per minute

    if (!limiter.success) {
        return NextResponse.json(
            { error: "Too many product creation attempts. Please try again later." },
            { 
                status: 429,
                headers: {
                    'X-RateLimit-Limit': '5',
                    'X-RateLimit-Remaining': limiter.remaining.toString(),
                    'X-RateLimit-Reset': limiter.reset.toString()
                }
            }
        );
    }

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
        return handleApiError(error);
    }
}
