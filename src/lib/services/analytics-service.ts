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
    
    /**
     * Get engagement counts for the last 7 days grouped by day.
     */
    static async getWeeklyEngagement(storeId: string) {
        await dbConnect();
        const oid = new mongoose.Types.ObjectId(storeId);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const aggregation = await Analytics.aggregate([
            {
                $match: {
                    storeId: oid,
                    timestamp: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$timestamp' },
                        month: { $month: '$timestamp' },
                        day: { $dayOfMonth: '$timestamp' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);

        // Standardize returning 7 days (even with zeros)
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString([], { weekday: 'short' });
            
            const match = aggregation.find(a => 
                a._id.day === d.getDate() && 
                a._id.month === (d.getMonth() + 1) && 
                a._id.year === d.getFullYear()
            );

            days.push({
                label: dateStr,
                value: match ? match.count : 0
            });
        }

        return days;
    }
}
