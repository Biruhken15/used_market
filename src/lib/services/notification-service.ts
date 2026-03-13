import dbConnect from '../db/mongoose';
import Notification from '../models/notification';

export class NotificationService {
    /**
     * Create a new notification for a user/store.
     */
    static async create(data: {
        userId: string;
        storeId?: string;
        type: 'subscription_expired' | 'limit_reached' | 'payment_success' | 'system_alert' | 'new_feature';
        title: string;
        message: string;
        metadata?: any;
    }) {
        await dbConnect();
        return await Notification.create(data);
    }

    /**
     * Get unread notifications for a user.
     */
    static async getUnread(userId: string) {
        await dbConnect();
        return await Notification.find({ userId, isRead: false }).sort({ createdAt: -1 });
    }

    /**
     * Mark a notification as read.
     */
    static async markAsRead(notificationId: string) {
        await dbConnect();
        return await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
    }

    /**
     * Mark all notifications as read for a user.
     */
    static async markAllAsRead(userId: string) {
        await dbConnect();
        return await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    }

    /**
     * Get recent notifications for a user (both read and unread).
     */
    static async getRecent(userId: string, limit: number = 20) {
        await dbConnect();
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(limit);
        const unreadCount = await Notification.countDocuments({ userId, isRead: false });
        return { notifications, unreadCount };
    }
}
