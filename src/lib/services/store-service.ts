import connectDB from "../db/mongoose";
import Store from "../models/store";
import User from "../models/user";
import { slugify } from "../utils/slug";

import { StoreSchema } from "../utils/validators";

export interface StoreData {
    ownerId: string;
    storeName: string;
    storeSlug?: string;
    description: string;
    category: string[];
    phone: string;
    whatsapp?: string;
    telegram?: string;
    address: string;
    email: string;
    sellerName: string;
    city: string;
    region?: string;
    country: string;
    idType: string;
    logo?: { url: string; publicId: string };
    coverImage?: { url: string; publicId: string };
    idFront?: { url: string; publicId: string };
    idBack?: { url: string; publicId: string };
    storeType?: 'standard' | 'broker';
}

export class StoreService {
    static async createStore(data: StoreData) {
        // 0. Validate Input
        if (!data.storeType) data.storeType = 'standard';
        const validatedData = StoreSchema.parse(data);

        await connectDB();

        // 1. Check if user already has a store
        const existingStore = await Store.findOne({ ownerId: data.ownerId });
        if (existingStore) {
            throw new Error("You already have an active store. Each user can only own one store.");
        }

        // 2. Handle Slug Generation & Uniqueness
        let storeSlug = data.storeSlug ? slugify(data.storeSlug) : slugify(data.storeName);

        if (!storeSlug) {
            throw new Error("Invalid store name. Please provide a valid name for your store URL.");
        }

        const slugExists = await Store.findOne({ storeSlug });
        if (slugExists) {
            if (data.storeSlug) {
                throw new Error(`The URL "ethio.market/${storeSlug}" is already taken. Please try a different one.`);
            }

            // Auto-generate unique slug if generic one is taken
            let counter = 1;
            let uniqueSlug = storeSlug;
            while (await Store.findOne({ storeSlug: uniqueSlug })) {
                uniqueSlug = `${storeSlug}-${counter}`;
                counter++;
            }
            storeSlug = uniqueSlug;
        }

        // 3. Create Store
        const newStore = await Store.create({
            ...data,
            storeSlug,
            city: data.city || "Addis Ababa",
            country: data.country || "Ethiopia",
            status: "approved" // Default to approved for now as per original logic
        });

        // 4. Update User Role
        await User.findByIdAndUpdate(data.ownerId, { role: "seller" });

        // 5. Assign Default Free Trial Subscription
        const { SubscriptionService } = await import("./subscription-service");
        await SubscriptionService.assignDefaultSubscription(data.ownerId, newStore._id.toString());

        return newStore;
    }

    static async getStoreByOwner(ownerId: string) {
        await connectDB();
        return await Store.findOne({ ownerId });
    }

    static async getStoreById(storeId: string) {
        await connectDB();
        return await Store.findById(storeId);
    }

    static async getAllStores() {
        await connectDB();
        return await Store.find({ status: "approved" }).sort({ createdAt: -1 });
    }

    static async updateStore(storeId: string, data: Partial<StoreData>) {
        await connectDB();
        const updatedStore = await Store.findByIdAndUpdate(
            storeId,
            { $set: data },
            { new: true, runValidators: true }
        );
        if (!updatedStore) {
            throw new Error("Store not found");
        }
        return updatedStore;
    }

    static async deleteStore(storeId: string) {
        await connectDB();
        const store = await Store.findById(storeId);
        if (!store) throw new Error("Store not found");

        // 1. Revert user role to 'user'
        await User.findByIdAndUpdate(store.ownerId, { role: "user" });

        // 2. Delete the store
        return await Store.findByIdAndDelete(storeId);
    }

    static async addStaff(storeId: string, email: string, role: string) {
        await connectDB();

        // 1. Find user by email
        const user = await User.findOne({ email });
        if (!user) throw new Error("User with this email not found. They must have an account first.");

        // 2. Check if user is already staff or owner
        const store = await Store.findById(storeId);
        if (store.ownerId.toString() === user._id.toString()) {
            throw new Error("This user is already the store owner.");
        }

        const isAlreadyStaff = store.staff.some((s: any) => s.userId.toString() === user._id.toString());
        if (isAlreadyStaff) {
            throw new Error("This user is already a staff member.");
        }

        // 3. Add to staff list
        return await Store.findByIdAndUpdate(
            storeId,
            {
                $push: {
                    staff: {
                        userId: user._id,
                        email: user.email,
                        role
                    }
                }
            },
            { new: true }
        );
    }

    static async removeStaff(storeId: string, userId: string) {
        await connectDB();
        return await Store.findByIdAndUpdate(
            storeId,
            { $pull: { staff: { userId } } },
            { new: true }
        );
    }

    static async getBrokers(page: number = 1, limit: number = 10) {
        await connectDB();
        const skip = (page - 1) * limit;

        const brokers = await Store.aggregate([
            { $match: { status: 'approved' } }, // All approved store owners as brokers
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'users',
                    localField: 'ownerId',
                    foreignField: '_id',
                    as: 'owner'
                }
            },
            { $unwind: '$owner' },
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
            {
                $project: {
                    storeName: 1,
                    storeSlug: 1,
                    description: 1,
                    category: 1,
                    country: 1,
                    city: 1,
                    region: 1,
                    logo: 1,
                    sellerName: 1,
                    'owner.profile': 1,
                    'owner.name': 1,
                    'owner.email': 1,
                    planName: '$plan.planName'
                }
            }
        ]);

        const total = await Store.countDocuments({ status: 'approved' });
        
        const { serialize } = await import("../utils/serialize");
        return {
            brokers: serialize(brokers),
            total,
            pages: Math.ceil(total / limit)
        };
    }

    static async getStores(page: number = 1, limit: number = 10) {
        await connectDB();
        const skip = (page - 1) * limit;

        const stores = await Store.aggregate([
            { $match: { status: 'approved' } },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'users',
                    localField: 'ownerId',
                    foreignField: '_id',
                    as: 'owner'
                }
            },
            { $unwind: '$owner' },
            {
                $project: {
                    storeName: 1,
                    storeSlug: 1,
                    description: 1,
                    category: 1,
                    city: 1,
                    region: 1,
                    logo: 1,
                    sellerName: 1,
                }
            }
        ]);

        const total = await Store.countDocuments({ status: 'approved' });
        
        const { serialize } = await import("../utils/serialize");
        return {
            stores: serialize(stores),
            total,
            pages: Math.ceil(total / limit)
        };
    }
}
