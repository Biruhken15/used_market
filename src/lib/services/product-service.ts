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

        // 2. Generate Slug explicitly to bypass validation issues
        const { slugify } = await import("../utils/slug");
        const baseSlug = slugify(data.title || "product");
        const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

        // 3. Create the product
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
        // Filter out handled ones to avoid conflicts
        const { minPrice, maxPrice, region, category, keyword, last24Hours, ...rest } = filters;
        Object.assign(matchStage, rest);

        // 1. Get total count for pagination
        // If hasPromotedPlan is true, we need to account for the join in the count
        let total = 0;
        if (filters.hasPromotedPlan) {
            // For promoted plans, we do a join count
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

        // 2. Fetch products
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
            { $unwind: { path: '$plan', preserveNullAndEmptyArrays: true } },
        ];

        // NEW: Apply post-lookup filters (e.g., store.storeType)
        const postLookupMatch: any = {};
        if (filters['store.storeType']) {
            postLookupMatch['store.storeType'] = filters['store.storeType'];
        }
        if (Object.keys(postLookupMatch).length > 0) {
            aggregationPipeline.push({ $match: postLookupMatch });
        }

        if (filters.hasPromotedPlan) {
            aggregationPipeline.push({ $match: { 'plan.features.hasHomepagePromotion': true } });
        }

        aggregationPipeline.push(
            {
                $addFields: {
                    rankingScore: {
                        $add: [
                            { $ifNull: ['$plan.features.searchRankingBoost', 0] },
                            { $cond: [{ $eq: ['$plan.features.hasVerifiedBadge', true] }, 10, 0] },
                            { $cond: [{ $eq: ['$isFeatured', true] }, 25, 0] },
                            { $cond: [{ $eq: ['$isUrgent', true] }, 30, 0] }
                        ]
                    },
                    isUrgentExpired: {
                        $cond: {
                            if: { $and: [{ $eq: ["$isUrgent", true] }, { $ne: ["$urgentSetAt", null] }] },
                            then: {
                                $gt: [
                                    { $divide: [{ $subtract: [new Date(), "$urgentSetAt"] }, 86400000] },
                                    { $ifNull: ["$plan.limits.urgentDurationDays", 0] }
                                ]
                            },
                            else: false
                        }
                    }
                }
            },
            { $sort: { rankingScore: -1, createdAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit }
        );

        let products = await Product.aggregate(aggregationPipeline);

        // 3. Fallback: If promoted batch is requested but empty, return featured products as promotions
        if (filters.hasPromotedPlan && products.length === 0) {
            const fallbackFilters = { ...matchStage, isFeatured: true };
            // Get total for featured fallback
            total = await Product.countDocuments(fallbackFilters);
            // Fetch featured as fallback
            products = await Product.aggregate([
                { $match: fallbackFilters },
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
                { $unwind: { path: '$plan', preserveNullAndEmptyArrays: true } },
                {
                    $addFields: {
                        rankingScore: {
                            $add: [
                                { $ifNull: ['$plan.features.searchRankingBoost', 0] },
                                { $cond: [{ $eq: ['$plan.features.hasVerifiedBadge', true] }, 10, 0] },
                                { $cond: [{ $eq: ['$isFeatured', true] }, 25, 0] },
                                { $cond: [{ $eq: ['$isUrgent', true] }, 30, 0] }
                            ]
                        },
                        isUrgentExpired: {
                            $cond: {
                                if: { $and: [{ $eq: ["$isUrgent", true] }, { $ne: ["$urgentSetAt", null] }] },
                                then: {
                                    $gt: [
                                        { $divide: [{ $subtract: [new Date(), "$urgentSetAt"] }, 86400000] },
                                        { $ifNull: ["$plan.limits.urgentDurationDays", 0] }
                                    ]
                                },
                                else: false
                            }
                        }
                    }
                },
                { $sort: { rankingScore: -1, createdAt: -1 } },
                { $skip: (page - 1) * limit },
                { $limit: limit }
            ]);
        }

        const result = {
            products: serialize(products),
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };

        // Store in cache
        cache.set(cacheKey, { data: result, expires: Date.now() + CACHE_TTL });

        // Periodically clean cache (crude but effective for memory safety)
        if (cache.size > 1000) {
            const now = Date.now();
            for (const [key, val] of cache.entries()) {
                if (val.expires < now) cache.delete(key);
            }
        }

        return result;
    }

    /**
     * Get products for a specific store.
     */
    static async getStoreProducts(storeId: string) {
        await dbConnect();
        const products = await Product.find({ storeId: new mongoose.Types.ObjectId(storeId) }).sort({ createdAt: -1 });
        return serialize(products);
    }

    /**
     * Mark a product as sold with subscription verification.
     */
    static async markAsSold(productId: string, ownerId: string) {
        await dbConnect();

        const product = await Product.findOne({
            _id: productId,
            ownerId: new mongoose.Types.ObjectId(ownerId)
        });

        if (!product) {
            throw new Error('Product not found or access denied');
        }

        // Verify subscription features
        const subscription = await SubscriptionService.getStoreSubscription(product.storeId.toString());
        const plan = subscription?.planId as any;

        if (!plan?.features?.canMarkAsSold) {
            throw new Error('Your current plan does not support marking items as sold. Please upgrade.');
        }

        product.status = 'sold';
        product.updatedAt = new Date();
        return await product.save();
    }

    /**
     * Update an existing product with ownership verification.
     */
    static async updateProduct(productId: string, ownerId: string, data: any) {
        await dbConnect();

        // Ownership and existence check
        const product = await Product.findOneAndUpdate(
            { _id: productId, ownerId: new mongoose.Types.ObjectId(ownerId) },
            { ...data, updatedAt: new Date() },
            { new: true }
        );

        if (!product) {
            throw new Error('Product not found or access denied');
        }

        return product;
    }

    /**
     * Delete a product listing.
     */
    static async deleteProduct(productId: string, ownerId: string) {
        await dbConnect();

        const result = await Product.deleteOne({
            _id: productId,
            ownerId: new mongoose.Types.ObjectId(ownerId)
        });

        if (result.deletedCount === 0) {
            throw new Error('Product not found or access denied');
        }

        return { success: true, message: 'Product deleted successfully' };
    }

    /**
     * Get the number of featured products for a store.
     */
    static async getStoreFeaturedCount(storeId: string) {
        await dbConnect();
        return await Product.countDocuments({
            storeId: new mongoose.Types.ObjectId(storeId),
            isFeatured: true,
            status: 'active'
        });
    }

    /**
     * Get a single product by ID.
     */
    static async getProductById(productId: string) {
        await dbConnect();
        const product = await Product.findById(productId).populate('storeId');
        if (!product) return null;
        return serialize(product);
    }
}
