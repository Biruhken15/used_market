import connectDB from "../db/mongoose";
import Store from "../models/store";
import User from "../models/user";
import { slugify } from "../utils/slug";

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
    sellerName: string;
    city: string;
    country: string;
    logo?: { url: string; publicId: string };
    coverImage?: { url: string; publicId: string };
}

export class StoreService {
    static async createStore(data: StoreData) {
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

        return newStore;
    }

    static async getStoreByOwner(ownerId: string) {
        await connectDB();
        return await Store.findOne({ ownerId });
    }
}
