import dbConnect from '../db/mongoose';
import User from '../models/user';
import Store from '../models/store';
import Product from '../models/product';
import Transaction from '../models/transaction';
import UserSubscription from '../models/user-subscription';

/**
 * Service for platform-wide administration and analytics.
 */
export class PlatformService {

    /**
     * Get global platform statistics.
     */
    static async getGlobalStats() {
        await dbConnect();

        const [
            userCount,
            storeCount,
            productCount,
            totalRevenue,
            activeSubscriptions
        ] = await Promise.all([
            User.countDocuments(),
            Store.countDocuments(),
            Product.countDocuments({ status: 'active' }),
            Transaction.aggregate([
                { $match: { status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            UserSubscription.countDocuments({ status: 'active' })
        ]);

        return {
            users: userCount,
            stores: storeCount,
            products: productCount,
            revenue: totalRevenue[0]?.total || 0,
            activeSubscriptions
        };
    }

    /**
     * Get a list of recent transactions across the platform.
     */
    static async getRecentTransactions(limit = 10) {
        await dbConnect();
        return await Transaction.find({})
            .populate('userId', 'name email')
            .populate('subscriptionPlanId', 'planName')
            .sort({ createdAt: -1 })
            .limit(limit);
    }

    /**
     * List all stores with their subscription status.
     */
    static async getAllStores() {
        await dbConnect();
        return await Store.aggregate([
            {
                $lookup: {
                    from: 'usersubscriptions',
                    localField: '_id',
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
            { $sort: { createdAt: -1 } }
        ]);
    }
}
