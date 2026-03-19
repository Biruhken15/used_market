import dbConnect from '../db/mongoose';
import Product from '../models/product';
import UserSubscription from '../models/user-subscription';
import { SubscriptionService } from './subscription-service';
import mongoose from 'mongoose';
import { serialize } from '../utils/serialize';

/**
 * Service to manage product listings and marketplace logic.
 */
export class ProductService {

    /**
     * Create a new product listing with subscription enforcement.
     */
    static async createProduct(ownerId: string, storeId: string, data: any) {
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
        await dbConnect();

        const matchStage: any = { status: 'active' };

        // Handle special filters
        if (filters.last24Hours) {
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
            matchStage.createdAt = { $gte: yesterday };
            delete filters.last24Hours;
        }

        // Apply remaining filters
        Object.assign(matchStage, filters);

        // We use aggregation to join with UserSubscription and SubscriptionPlan for ranking and promotions
        const products = await Product.aggregate([
            { $match: matchStage },
            // Join with Store to get store information (like storeType)
            {
                $lookup: {
                    from: 'stores',
                    localField: 'storeId',
                    foreignField: '_id',
                    as: 'store'
                }
            },
            { $unwind: { path: '$store', preserveNullAndEmptyArrays: true } },
            // Join with UserSubscription to get the plan
            {
                $lookup: {
                    from: 'usersubscriptions', // Mongoose model name lowercase + s
                    localField: 'storeId',
                    foreignField: 'storeId',
                    as: 'subscription'
                }
            },
            { $unwind: { path: '$subscription', preserveNullAndEmptyArrays: true } },
            // Join with SubscriptionPlan to get the boost and features
            {
                $lookup: {
                    from: 'subscriptionplans',
                    localField: 'subscription.planId',
                    foreignField: '_id',
                    as: 'plan'
                }
            },
            { $unwind: { path: '$plan', preserveNullAndEmptyArrays: true } },

            // Filter by hasPromotedPlan if requested
            ...(filters.hasPromotedPlan ? [{ $match: { 'plan.features.hasHomepagePromotion': true } }] : []),

            // Calculate a score for sorting
            {
                $addFields: {
                    rankingScore: {
                        $add: [
                            { $ifNull: ['$plan.features.searchRankingBoost', 0] },
                            // Add other factors here (e.g., recency, verified badge)
                            { $cond: [{ $eq: ['$plan.features.hasVerifiedBadge', true] }, 10, 0] },
                            { $cond: [{ $eq: ['$isFeatured', true] }, 25, 0] },
                            { $cond: [{ $eq: ['$isUrgent', true] }, 30, 0] }
                        ]
                    }
                }
            },
            // Sort by rankingScore DESC, then createdAt DESC
            { $sort: { rankingScore: -1, createdAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit }
        ]);

        return serialize(products);
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
        const product = await Product.findById(productId);
        if (!product) throw new Error('Product not found');
        return serialize(product);
    }
}
