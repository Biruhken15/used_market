import dbConnect from '../db/mongoose';
import User from '../models/user';
import Store from '../models/store';
import Product from '../models/product';
import UserSubscription from '../models/user-subscription';
import SubscriptionPlan from '../models/subscription-plan';
import { SubscriptionService } from './subscription-service';
import bcrypt from 'bcryptjs';

export class SeedService {
    static async seedAll() {
        await dbConnect();

        // 1. Clear existing data (Be careful with this in production!)
        // For development seeding, we only clear if explicitly asked, but here we will keep it simple.
        
        // 2. Seed Plans first (Required for subscriptions)
        await SubscriptionService.seedPlans();
        const plans = await SubscriptionPlan.find();
        const proPlan = plans.find(p => p.planCode === 'PRO_SELLER');
        const enterprisePlan = plans.find(p => p.planCode === 'ENTERPRISE_SELLER');
        const freePlan = plans.find(p => p.planCode === 'FREE_TRIAL');

        // 3. Create Sample Users
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        const users = [
            { name: 'Admin User', email: 'admin@ethio.market', password: hashedPassword, role: 'admin' },
            { name: 'Pro Seller', email: 'pro@ethio.market', password: hashedPassword, role: 'seller' },
            { name: 'Elite Broker', email: 'broker@ethio.market', password: hashedPassword, role: 'seller' },
            { name: 'Standard Buyer', email: 'user@ethio.market', password: hashedPassword, role: 'user' },
        ];

        for (const userData of users) {
            await User.findOneAndUpdate({ email: userData.email }, userData, { upsert: true, new: true });
        }

        const dbProSeller = await User.findOne({ email: 'pro@ethio.market' });
        const dbBroker = await User.findOne({ email: 'broker@ethio.market' });

        // 4. Create Sample Stores
        const stores = [
            {
                ownerId: dbProSeller._id,
                storeName: 'Pro Electronics Hub',
                storeSlug: 'pro-electronics',
                description: 'Leading provider of high-end consumer electronics.',
                category: ['electronics', 'phones'],
                storeType: 'standard',
                phone: '0912345678',
                address: 'Bole, Addis Ababa',
                email: 'pro@ethio.market',
                city: 'Addis Ababa',
                country: 'Ethiopia',
                idType: 'National ID',
                sellerName: 'Pro Seller Inc.',
                status: 'approved'
            },
            {
                ownerId: dbBroker._id,
                storeName: 'Elite Real Estate Brokers',
                storeSlug: 'elite-brokers',
                description: 'Expert property brokerage for luxury houses and apartments.',
                category: ['real-estate', 'houses'],
                storeType: 'broker',
                phone: '0987654321',
                address: 'Megenagna, Addis Ababa',
                email: 'broker@ethio.market',
                city: 'Addis Ababa',
                region: 'Addis Ababa',
                country: 'Ethiopia',
                idType: 'Driver License',
                sellerName: 'Elite Brokerage Group',
                status: 'approved'
            }
        ];

        for (const storeData of stores) {
            const store = await Store.findOneAndUpdate({ storeSlug: storeData.storeSlug }, storeData, { upsert: true, new: true });
            
            // Assign corresponding subscription
            const planToAssign = storeData.storeType === 'broker' ? enterprisePlan : proPlan;
            if (planToAssign) {
                await UserSubscription.findOneAndUpdate(
                    { storeId: store._id },
                    { 
                        userId: storeData.ownerId, 
                        storeId: store._id, 
                        planId: planToAssign._id,
                        status: 'active',
                        startDate: new Date(),
                        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
                    },
                    { upsert: true }
                );
            }
        }

        const proStore = await Store.findOne({ storeSlug: 'pro-electronics' });
        const brokerStore = await Store.findOne({ storeSlug: 'elite-brokers' });

        // 5. Create Sample Products
        const products = [
            // Pro Store Products (Urgent/Featured)
            {
                title: 'MacBook Pro M3 Max (Sealed)',
                slug: 'macbook-pro-m3-max-sealed',
                description: 'Brand new, latest generation MacBook Pro. Ready for heavy development.',
                price: 450000,
                category: 'electronics',
                condition: 'new',
                storeId: proStore._id,
                ownerId: dbProSeller._id,
                isUrgent: true,
                isFeatured: true,
                status: 'active'
            },
            {
                title: 'iPhone 15 Pro Max 256GB Natural Titanium',
                slug: 'iphone-15-pro-max-titanium',
                description: 'Mint condition, only used for a week. Comes with all accessories.',
                price: 180000,
                category: 'phones',
                condition: 'like-new',
                storeId: proStore._id,
                ownerId: dbProSeller._id,
                isUrgent: false,
                isFeatured: true,
                status: 'active'
            },
            // Broker Store Products
            {
                title: 'Luxury Villa in Ayat',
                slug: 'luxury-villa-ayat',
                description: 'Specious 5-bedroom villa with modern finishing and large backyard.',
                price: 75000000,
                category: 'real-estate',
                condition: 'new',
                storeId: brokerStore._id,
                ownerId: dbBroker._id,
                isUrgent: true,
                isFeatured: false,
                status: 'active'
            },
            {
                title: 'Modern Apartment near Bole Atlas',
                slug: 'modern-apartment-bole-atlas',
                description: 'Fully furnished 2-bedroom apartment with 24/7 security and parking.',
                price: 12000000,
                category: 'houses',
                condition: 'good',
                storeId: brokerStore._id,
                ownerId: dbBroker._id,
                isUrgent: false,
                isFeatured: true,
                status: 'active'
            }
        ];

        for (const productData of products) {
            // Add placeholder image
            const productWithImage = {
                ...productData,
                images: [{ url: 'https://placehold.co/600x400/f1f5f9/94a3b8?text=' + encodeURIComponent(productData.title), publicId: 'sample' }],
                thumbnail: 'https://placehold.co/600x400/f1f5f9/94a3b8?text=' + encodeURIComponent(productData.title)
            };
            await Product.findOneAndUpdate({ slug: productData.slug }, productWithImage, { upsert: true });
        }

        return { success: true, message: 'Full Marketplace Seeded Successfully' };
    }

    static async cleanup() {
        await dbConnect();

        const seedEmails = [
            'admin@ethio.market',
            'pro@ethio.market',
            'broker@ethio.market',
            'user@ethio.market'
        ];

        // 1. Find seeded users
        const seededUsers = await User.find({ email: { $in: seedEmails } });
        const userIds = seededUsers.map(u => u._id);

        // 2. Find seeded stores
        const seededStores = await Store.find({ ownerId: { $in: userIds } });
        const storeIds = seededStores.map(s => s._id);

        // 3. Delete products from those stores
        await Product.deleteMany({ storeId: { $in: storeIds } });

        // 4. Delete subscriptions for those stores
        await UserSubscription.deleteMany({ storeId: { $in: storeIds } });

        // 5. Delete those stores
        await Store.deleteMany({ ownerId: { $in: userIds } });

        // 6. Delete those users
        await User.deleteMany({ email: { $in: seedEmails } });

        return { success: true, message: 'All seeded data has been removed from the database' };
    }
}
