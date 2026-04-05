import dbConnect from '../db/mongoose';
import Product from '../models/product';
import Store from '../models/store';
import UserSubscription from '../models/user-subscription';
import { SubscriptionService } from './subscription-service';
import mongoose from 'mongoose';
import { serialize } from '../utils/serialize';

// Simple TTL Cache for high-volume marketplace queries
const cache = new Map<string, { data: any, expires: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

import { ProductSchema } from '../utils/validators';

/**
 * Service to manage product listings and marketplace logic.
 */
export class ProductService {

    /**
     * Create a new product listing with subscription enforcement.
     */
    static async createProduct(ownerId: string, storeId: string, data: any) {
        // 0. Validate Input
        const validatedData = ProductSchema.parse(data);
        
        await dbConnect();

        // 1. Check listing limits
        const currentCount = await Product.countDocuments({ storeId, status: 'active' });
        const canAdd = await SubscriptionService.canAddProduct(storeId, currentCount);

        if (!canAdd.allowed) {
            throw new Error(canAdd.reason);
        }

        // 2. Fetch Subscription & Enforce Premium Features
        const subscription = await SubscriptionService.getStoreSubscription(storeId);
        const plan = subscription?.planId as any;

        // Strip "Urgent" if plan doesn't allow it
        if (data.isUrgent && !plan?.features?.canMarkAsUrgent) {
            console.warn(`[Security] Unauthorized 'isUrgent' flag stripped for store: ${storeId}`);
            data.isUrgent = false;
        }

        // Strip "Featured" if plan has no featured allowance
        if (data.isFeatured && (plan?.limits?.featuredListingsPerMonth || 0) === 0) {
            console.warn(`[Security] Unauthorized 'isFeatured' flag stripped for store: ${storeId}`);
            data.isFeatured = false;
        }

        // 3. Generate Slug explicitly to bypass validation issues
        const { slugify } = await import("../utils/slug");
        const baseSlug = slugify(data.title || "product");
        const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

        // 4. Create the product
        return await Product.create({
            ...data,
            slug: uniqueSlug,
            ownerId: new mongoose.Types.ObjectId(ownerId),
            storeId: new mongoose.Types.ObjectId(storeId),
            status: 'active'
        });
    }

    /**
     * Fetch products for the marketplace with search ranking boost and special filters.
     */
    static async getMarketplaceProducts(filters: any = {}, page = 1, limit = 20) {
        const cacheKey = `marketplace_${JSON.stringify(filters)}_${page}_${limit}`;
        const cached = cache.get(cacheKey);
        
        if (cached && cached.expires > Date.now()) {
            return cached.data;
        }

        await dbConnect();

        const matchStage: any = { status: 'active' };

        // Handle Price Range
        if (filters.minPrice || filters.maxPrice) {
            matchStage.price = {};
            if (filters.minPrice) matchStage.price.$gte = Number(filters.minPrice);
            if (filters.maxPrice) matchStage.price.$lte = Number(filters.maxPrice);
        }

        // Handle Region (Case-insensitive)
        if (filters.region && filters.region !== 'All Regions') {
            matchStage.region = { $regex: `^${filters.region}$`, $options: 'i' };
        }

        // Handle Category (Case-insensitive)
        if (filters.category && filters.category !== 'All Categories') {
            matchStage.category = { $regex: `^${filters.category}$`, $options: 'i' };
        }

        // Handle Keyword Search using MongoDB Text Index
        if (filters.keyword) {
            matchStage.$text = { $search: filters.keyword };
        }

        // Handle special filters
        if (filters.last24Hours) {
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
            matchStage.createdAt = { $gte: yesterday };
        }

        // Apply remaining filters (like isFeatured, isUrgent, storeId, etc.)
        const { minPrice, maxPrice, region, category, keyword, last24Hours, hasPromotedPlan, ...rest } = filters;
        Object.assign(matchStage, rest);

        let total = 0;
        if (hasPromotedPlan) {
            const promoCount = await Product.aggregate([
                { $match: matchStage },
                {
                    $lookup: {
                        from: 'usersubscriptions',
                        localField: 'storeId',
                        foreignField: 'storeId',
                        as: 'subscription'
                    }
                },
                { $unwind: '$subscription' },
                {
                    $lookup: {
                        from: 'subscriptionplans',
                        localField: 'subscription.planId',
                        foreignField: '_id',
                        as: 'plan'
                    }
                },
                { $unwind: '$plan' },
                { $match: { 'plan.features.hasHomepagePromotion': true } },
                { $count: 'total' }
            ]);
            total = promoCount[0]?.total || 0;
        } else {
            total = await Product.countDocuments(matchStage);
        }

        const aggregationPipeline: any[] = [
            { $match: matchStage },
            {
                $lookup: {
                    from: 'stores',
                    localField: 'storeId',
                    foreignField: '_id',
                    as: 'store'
                }
            },
            { $unwind: { path: '$store', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'usersubscriptions',
                    localField: 'storeId',
                    foreignField: 'storeId',
                    as: 'subscription'
                }
            },
            { $unwind: { path: '$subscription', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'subscriptionplans',
                    localField: 'subscription.planId',
                    foreignField: '_id',
                    as: 'plan'
                }
            },
            { $unwind: { path: '$plan', preserveNullAndEmptyArrays: true } }
        ];

        // NEW: Homepage Promotion Logic for Enterprise Tiers
        if (hasPromotedPlan) {
            const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            aggregationPipeline.push(
                { $match: { 
                    'plan.features.hasHomepagePromotion': true,
                    'createdAt': { $gte: lastWeek } 
                } },
                // Sort by recency then limit per person would require grouping, 
                // but for now we take the top 5 overall from Enterprise tier
                { $sort: { createdAt: -1 } },
                { $limit: 5 }
            );
        }

        aggregationPipeline.push(
            {
                $addFields: {
                    rankingScore: {
                        $add: [
                            { $ifNull: ['$plan.features.searchRankingBoost', 0] },
                            { $cond: [{ $eq: ['$plan.features.hasVerifiedBadge', true] }, 10, 0] },
                            { $cond: [{ $eq: ['$isFeatured', true] }, 25, 0] },
                            { $cond: [{ $eq: ["$isUrgent", true] }, 30, 0] }
                        ]
                    }
                }
            },
            { $sort: { rankingScore: -1, createdAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            { 
                $project: {
                    title: 1, slug: 1, price: 1, priceType: 1, category: 1, 
                    description: 1, images: 1, isUrgent: 1, isFeatured: 1, status: 1, 
                    createdAt: 1, region: 1, storeId: 1, rankingScore: 1,
                    'store.storeName': 1, 'store.logo': 1, 'store.storeSlug': 1
                }
            }
        );

        let products = await Product.aggregate(aggregationPipeline);

        if (filters.hasPromotedPlan && products.length === 0) {
            const fallbackFilters = { ...matchStage, isFeatured: true };
            total = await Product.countDocuments(fallbackFilters);
            products = await Product.aggregate([
                { $match: fallbackFilters },
                { $lookup: { from: 'stores', localField: 'storeId', foreignField: '_id', as: 'store' } },
                { $unwind: { path: '$store', preserveNullAndEmptyArrays: true } },
                { $sort: { createdAt: -1 } },
                { $skip: (page - 1) * limit },
                { $limit: limit },
                { 
                    $project: {
                        title: 1, slug: 1, price: 1, priceType: 1, category: 1, 
                        description: 1, images: 1, isUrgent: 1, isFeatured: 1, status: 1, 
                        createdAt: 1, region: 1, storeId: 1,
                        'store.storeName': 1, 'store.logo': 1, 'store.storeSlug': 1
                    }
                }
            ]);
        }

        const result = {
            products: serialize(products),
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };

        cache.set(cacheKey, { data: result, expires: Date.now() + CACHE_TTL });
        return result;
    }

    static async getStoreProducts(storeId: string) {
        await dbConnect();
        const products = await Product.find({ storeId: new mongoose.Types.ObjectId(storeId) })
            .select('_id title slug price priceType category description images isUrgent isFeatured status createdAt region')
            .sort({ createdAt: -1 })
            .lean();
        return serialize(products);
    }

    static async markAsSold(productId: string, ownerId: string) {
        await dbConnect();
        const product = await Product.findOneAndUpdate(
            { _id: productId, ownerId: new mongoose.Types.ObjectId(ownerId) },
            { $set: { status: 'sold', updatedAt: new Date() } },
            { new: true }
        );
        if (!product) throw new Error('Product not found or access denied');
        return product;
    }

    static async updateProduct(productId: string, ownerId: string, data: any) {
        await dbConnect();
        
        // Ownership check & Feature strip
        const productToCheck = await Product.findById(productId).lean();
        if (productToCheck) {
            const subscription = await SubscriptionService.getStoreSubscription(productToCheck.storeId.toString());
            const plan = subscription?.planId as any;

            if (data.isUrgent && !plan?.features?.canMarkAsUrgent) data.isUrgent = false;
            if (data.isFeatured && (plan?.limits?.featuredListingsPerMonth || 0) === 0) data.isFeatured = false;
        }

        const product = await Product.findOneAndUpdate(
            { _id: productId, ownerId: new mongoose.Types.ObjectId(ownerId) },
            { $set: { ...data, updatedAt: new Date() } },
            { new: true }
        );
        if (!product) throw new Error('Product not found or access denied');
        return product;
    }

    static async deleteProduct(productId: string, ownerId: string) {
        await dbConnect();
        const result = await Product.deleteOne({ _id: productId, ownerId: new mongoose.Types.ObjectId(ownerId) });
        if (result.deletedCount === 0) throw new Error('Product not found or access denied');
        return { success: true };
    }

    static async getStoreFeaturedCount(storeId: string) {
        await dbConnect();
        return await Product.countDocuments({ storeId: new mongoose.Types.ObjectId(storeId), isFeatured: true, status: 'active' });
    }

    static async getProductById(productId: string) {
        await dbConnect();
        const product = await Product.findById(productId).populate('storeId').lean();
        return serialize(product);
    }
}
