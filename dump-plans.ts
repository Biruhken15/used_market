import mongoose from 'mongoose';
const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/used-store';

async function dumpPlans() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(dbUri);
        console.log('Connected.');

        // Define model on the fly
        const schema = new mongoose.Schema({}, { strict: false });
        const Plan = mongoose.models.SubscriptionPlan || mongoose.model('SubscriptionPlan', schema, 'subscriptionplans');

        const plans = await Plan.find({}).lean();
        console.log(`Found ${plans.length} plans.`);
        plans.forEach((p: any) => {
            console.log(`- ID: ${p._id}, Code: ${p.planCode}, Name: ${p.planName}, Price: ${p.price}`);
        });

        await mongoose.disconnect();
        console.log('Disconnected.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

dumpPlans();
