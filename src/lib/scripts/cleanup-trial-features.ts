import dbConnect from '../db/mongoose';
import Product from '../models/product';
import UserSubscription from '../models/user-subscription';
import { SubscriptionService } from '../services/subscription-service';
import mongoose from 'mongoose';

/**
 * Cleanup script to strip 'isFeatured' and 'isUrgent' from products 
 * belonging to stores without the appropriate subscription plan.
 */
async function cleanupUnauthorizedFeatures() {
    console.log('--- Starting Unauthorized Feature Cleanup ---');
    await dbConnect();

    const products = await Product.find({ 
        $or: [{ isFeatured: true }, { isUrgent: true }] 
    }).lean();

    console.log(`Found ${products.length} products with premium flags to verify.`);

    let strippedCount = 0;

    for (const product of products) {
        const subscription = await UserSubscription.findOne({ storeId: product.storeId })
            .populate('planId')
            .lean() as any;
        
        const plan = subscription?.planId as any;
        let needsUpdate = false;
        const updateData: any = {};

        // Check Featured Enforcement
        if (product.isFeatured && (plan?.limits?.featuredListingsPerMonth || 0) === 0) {
            console.log(`Stripping Featured from product: ${product._id} (Store: ${product.storeId})`);
            updateData.isFeatured = false;
            needsUpdate = true;
        }

        // Check Urgent Enforcement
        if (product.isUrgent && !plan?.features?.canMarkAsUrgent) {
            console.log(`Stripping Urgent from product: ${product._id} (Store: ${product.storeId})`);
            updateData.isUrgent = false;
            needsUpdate = true;
        }

        if (needsUpdate) {
            await Product.findByIdAndUpdate(product._id, { $set: updateData });
            strippedCount++;
        }
    }

    console.log(`--- Cleanup Complete. Stripped ${strippedCount} unauthorized flags. ---`);
    process.exit(0);
}

// Check if run directly
if (require.main === module) {
    cleanupUnauthorizedFeatures().catch(err => {
        console.error('Cleanup failed:', err);
        process.exit(1);
    });
}

export default cleanupUnauthorizedFeatures;
