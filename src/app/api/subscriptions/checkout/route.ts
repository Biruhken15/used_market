import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils/auth';
import { PaymentService, PaymentMethod } from '@/lib/services/payment-service';
import SubscriptionPlan from '@/lib/models/subscription-plan';
import Store from '@/lib/models/store';
import dbConnect from '@/lib/db/mongoose';

/**
 * API to initiate a subscription checkout.
 */
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { planId, paymentMethod, subscriberName, subscriberEmail, subscriberPhone, productId } = await req.json();

        if (!planId || !paymentMethod) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();

        // 1. Get the plan details
        const plan = await SubscriptionPlan.findById(planId);
        if (!plan) {
            return NextResponse.json({ error: 'Invalid plan' }, { status: 404 });
        }

        // 2. Get the store for the current user
        let store = await Store.findOne({ ownerId: (session.user as any).id });
        if (!store) {
            // Shadow Store Logic: Create a store on the fly if it doesn't exist
            const { StoreService } = await import("@/lib/services/store-service");
            store = await StoreService.ensureUserHasStore(
                (session.user as any).id,
                (session.user as any).name || "Seller",
                "", // Phone will be captured in checkout form
                (session.user as any).email || ""
            );
        }

        // 3. Use the flat price
        const amount = typeof plan.price === 'number' ? plan.price : 0;

        if (amount <= 0 && plan.planCode !== 'FREE_TRIAL') {
            console.error(`Invalid price for plan ${plan.planCode}:`, plan.price);
            return NextResponse.json({ error: 'System Error: Plan pricing is not correctly configured.' }, { status: 500 });
        }

        // 4. Derive billing cycle from plan duration
        const durationMonths = plan.durationMonths || 1;
        const billingCycle = durationMonths === 12 ? 'yearly' : durationMonths === 3 ? 'quarterly' : 'monthly';

        // 5. Initiate payment with Chapa
        try {
            const result = await PaymentService.initiatePayment({
                userId: (session.user as any).id,
                storeId: store._id.toString(),
                planId: plan._id.toString(),
                productId, // Pass productId here
                amount,
                email: subscriberEmail || (session.user as any).email,
                firstName: subscriberName?.split(' ')[0] || (session.user as any).name?.split(' ')[0] || 'Store',
                lastName: subscriberName?.split(' ').slice(1).join(' ') || (session.user as any).name?.split(' ')[1] || 'Owner',
                paymentMethod,
                phone: subscriberPhone,
                billingCycle
            });
            return NextResponse.json(result);
        } catch (paymentError: any) {
            console.error('Payment Initialization Error:', paymentError);
            return NextResponse.json({ error: `Payment system error: ${paymentError.message}` }, { status: 500 });
        }
    } catch (error: any) {
        console.error('Checkout failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
