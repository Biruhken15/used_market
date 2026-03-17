import dbConnect from '../db/mongoose';
import Product from '../models/product';
import UserSubscription from '../models/user-subscription';
import { SubscriptionService } from './subscription-service';
import mongoose from 'mongoose';

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
     * Fetch products for the marketplace with search ranking boost.
     */
    static async getMarketplaceProducts(filters: any = {}, page = 1, limit = 20) {
        await dbConnect();

        // We use aggregation to join with UserSubscription and SubscriptionPlan for ranking
        const products = await Product.aggregate([
            { $match: { status: 'active', ...filters } },
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
            // Join with SubscriptionPlan to get the boost
            {
                $lookup: {
                    from: 'subscriptionplans',
                    localField: 'subscription.planId',
                    foreignField: '_id',
                    as: 'plan'
                }
            },
            { $unwind: { path: '$plan', preserveNullAndEmptyArrays: true } },
            // Calculate a score for sorting
            {
                $addFields: {
                    rankingScore: {
                        $add: [
                            { $ifNull: ['$plan.features.searchRankingBoost', 0] },
                            // Add other factors here (e.g., recency, verified badge)
                            { $cond: [{ $eq: ['$plan.features.hasVerifiedBadge', true] }, 10, 0] },
                            { $cond: [{ $eq: ['$isFeatured', true] }, 25, 0] }
                        ]
                    }
                }
            },
            // Sort by rankingScore DESC, then createdAt DESC
            { $sort: { rankingScore: -1, createdAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit }
        ]);

        return products;
    }

    /**
     * Get products for a specific store.
     */
    static async getStoreProducts(storeId: string) {
        await dbConnect();
        return await Product.find({ storeId: new mongoose.Types.ObjectId(storeId) }).sort({ createdAt: -1 });
    }

    /**
     * Mark a product as sold with subscription enforcement.
     */
    static async markAsSold(productId: string, storeId: string) {
        await dbConnect();

        const subscription = await SubscriptionService.getStoreSubscription(storeId);
        const plan = subscription?.planId as any;

        if (!plan?.features?.canMarkAsSold) {
            throw new Error(`The ${plan?.planName || 'Free'} plan does not support marking items as sold. Please upgrade.`);
        }

        const product = await Product.findOneAndUpdate(
            { _id: productId, storeId: new mongoose.Types.ObjectId(storeId) },
            { status: 'sold' },
            { new: true }
        );

        if (!product) {
            throw new Error('Product not found or access denied');
        }

        return product;
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
}
