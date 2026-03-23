import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/utils/admin-auth';
import User from '@/lib/models/user';
import Store from '@/lib/models/store';
import Product from '@/lib/models/product';
import mongoose from 'mongoose';

export async function GET(req: Request) {
    const { error } = await requireAdmin();
    if (error) return error;

    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q')?.trim();

        if (!q || q.length < 2) {
            return NextResponse.json({ users: [], stores: [], products: [] });
        }

        // Check if query looks like a MongoDB ObjectId (24 hex chars)
        const isObjectId = /^[a-f\d]{24}$/i.test(q);

        // --- USERS: search by name or email ---
        const userQuery = isObjectId
            ? { _id: new mongoose.Types.ObjectId(q) }
            : { $or: [
                { name: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } }
            ]};
        const users = await User.find(userQuery)
            .select('-password')
            .limit(5)
            .lean();

        // --- STORES: search by storeName, sellerName, or ownerId ---
        const storeQuery = isObjectId
            ? { $or: [
                { _id: new mongoose.Types.ObjectId(q) },
                { ownerId: new mongoose.Types.ObjectId(q) }
            ]}
            : { $or: [
                { storeName: { $regex: q, $options: 'i' } },
                { sellerName: { $regex: q, $options: 'i' } },
                { storeSlug: { $regex: q, $options: 'i' } }
            ]};
        const stores = await Store.find(storeQuery)
            .populate({ path: 'ownerId', select: 'name email _id', model: User })
            .limit(5)
            .lean();

        // --- PRODUCTS: search by title, slug, or IDs ---
        const productQuery = isObjectId
            ? { $or: [
                { _id: new mongoose.Types.ObjectId(q) },
                { storeId: new mongoose.Types.ObjectId(q) },
                { ownerId: new mongoose.Types.ObjectId(q) }
            ]}
            : { $or: [
                { title: { $regex: q, $options: 'i' } },
                { category: { $regex: q, $options: 'i' } }
            ]};
        const products = await Product.find(productQuery)
            .populate({ path: 'storeId', select: 'storeName', model: Store })
            .populate({ path: 'ownerId', select: 'name', model: User })
            .limit(5)
            .lean();

        return NextResponse.json({ users, stores, products });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
