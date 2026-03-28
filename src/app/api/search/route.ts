import { NextResponse } from 'next/server';
import Store from '@/lib/models/store';
import Product from '@/lib/models/product';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/mongoose';

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q')?.trim();

        if (!q || q.length < 2) {
            return NextResponse.json({ stores: [], products: [] });
        }

        const isObjectId = /^[a-f\d]{24}$/i.test(q);

        // --- STORES: public search by storeName ---
        const storeQuery = isObjectId
            ? { _id: new mongoose.Types.ObjectId(q), status: 'approved' }
            : { storeName: { $regex: q, $options: 'i' }, status: 'approved' };
        
        const stores = await Store.find(storeQuery)
            .select('storeName storeSlug logo _id')
            .limit(3)
            .lean();

        // --- PRODUCTS: public search by title or category ---
        const productQuery = isObjectId
            ? { _id: new mongoose.Types.ObjectId(q), status: 'active' }
            : { 
                $or: [
                    { title: { $regex: q, $options: 'i' } },
                    { category: { $regex: q, $options: 'i' } },
                    { region: { $regex: q, $options: 'i' } }
                ],
                status: 'active'
              };
        
        const products = await Product.find(productQuery)
            .select('title slug images price _id')
            .limit(5)
            .lean();

        return NextResponse.json({ stores, products });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
