import dbConnect from '../db/mongoose';
import Analytics, { IAnalytics } from '../models/analytics';
import mongoose from 'mongoose';

/**
 * Service to handle store and product analytics.
 */
export class AnalyticsService {

    /**
     * Record an analytics event.
     */
    static async trackEvent(data: {
        type: IAnalytics['type'];
        targetId: string;
        storeId: string;
        viewerId?: string;
        deviceType?: string;
        location?: { city?: string; region?: string };
    }) {
        await dbConnect();
        return await Analytics.create({
            ...data,
            targetId: new mongoose.Types.ObjectId(data.targetId),
            storeId: new mongoose.Types.ObjectId(data.storeId),
            timestamp: new Date()
        });
    }

    /**
     * Get summary metrics for a store.
     */
    static async getStoreMetrics(storeId: string) {
        await dbConnect();
        const oid = new mongoose.Types.ObjectId(storeId);

        const counts = await Analytics.aggregate([
            { $match: { storeId: oid } },
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 }
                }
            }
        ]);

        const metrics: Record<string, number> = {
            store_view: 0,
            product_view: 0,
            contact_click: 0,
            search_impression: 0
        };

        counts.forEach(c => {
            if (metrics.hasOwnProperty(c._id)) {
                metrics[c._id] = c.count;
            }
        });

        return metrics;
    }

    /**
     * Get recent activity for a store.
     */
    static async getRecentActivity(storeId: string, limit = 10) {
        await dbConnect();
        return await Analytics.find({ storeId: new mongoose.Types.ObjectId(storeId) })
            .sort({ timestamp: -1 })
            .limit(limit);
    }
}
