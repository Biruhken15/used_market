import mongoose from 'mongoose';
const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/used-store';

async function checkPlans() {
    try {
        await mongoose.connect(dbUri);
        const Plan = mongoose.model('SubscriptionPlan', new mongoose.Schema({ planCode: String, planName: String }));
        const plans = await Plan.find({});
        console.log('Available Plans in DB:');
        plans.forEach(p => console.log(`- ${p.planCode}: ${p.planName}`));
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkPlans();
