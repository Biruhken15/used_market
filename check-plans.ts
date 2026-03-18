import dbConnect from './src/lib/db/mongoose';
import SubscriptionPlan from './src/lib/models/subscription-plan';

async function checkPlans() {
    try {
        await dbConnect();
        const plans = await SubscriptionPlan.find({});
        console.log('Available Plans in DB:');
        plans.forEach(p => console.log(`- ${p.planCode}: ${p.planName}`));
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkPlans();
