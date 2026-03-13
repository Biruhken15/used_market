import dbConnect from '../db/mongoose';
import Transaction from '../models/transaction';
import UserSubscription from '../models/user-subscription';
import SubscriptionPlan from '../models/subscription-plan';
import { NotificationService } from './notification-service';

export type PaymentMethod = 'telebirr' | 'cbe_birr' | 'mpesa';

/**
 * Service to handle payments via Chapa for the Ethiopian market.
 */
export class PaymentService {

    /**
     * Initiate a payment via Chapa Gateway.
     */
    static async initiatePayment(params: {
        userId: string;
        storeId: string;
        planId: string;
        amount: number;
        email: string;
        firstName: string;
        lastName: string;
        billingCycle: 'monthly' | 'quarterly' | 'yearly';
    }) {
        await dbConnect();

        // 1. Generate a unique transaction reference (tx_ref)
        const tx_ref = `CHAPA-${params.storeId}-${Date.now()}`;

        // 2. Create a pending transaction in our DB
        const transaction = await Transaction.create({
            userId: params.userId,
            storeId: params.storeId,
            subscriptionPlanId: params.planId,
            amount: params.amount,
            paymentMethod: 'other', // Chapa handles multiple methods
            referenceId: tx_ref,
            billingCycle: params.billingCycle,
            status: 'pending'
        });

        // 3. Chapa Integration Logic
        const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
        const CALLBACK_URL = `${process.env.NEXTAUTH_URL}/api/subscriptions/verify?tx_ref=${tx_ref}`;
        const RETURN_URL = `${process.env.NEXTAUTH_URL}/seller/checkout/verify?tx_ref=${tx_ref}`;

        if (!CHAPA_SECRET_KEY) {
            console.warn('CHAPA_SECRET_KEY not found. Falling back to mock Chapa response.');
            return {
                status: 'success',
                message: 'Checkout URL generated (Mock)',
                data: {
                    checkout_url: `/seller/checkout?tx_ref=${tx_ref}&mock=true`
                }
            };
        }

        try {
            const response = await fetch('https://api.chapa.co/v1/transaction/initialize', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: params.amount,
                    currency: 'ETB',
                    email: params.email,
                    first_name: params.firstName,
                    last_name: params.lastName,
                    tx_ref: tx_ref,
                    callback_url: CALLBACK_URL,
                    return_url: RETURN_URL,
                    customization: {
                        title: 'Store Upgrade',
                        description: `Payment for ${params.billingCycle} plan`
                    }
                })
            });

            const data = await response.json();
            console.log('Chapa Initialization Response:', data);
            return data; // Returns { status, message, data: { checkout_url } }
        } catch (error) {
            console.error('Chapa Initialization Error:', error);
            throw new Error('Failed to initialize payment with Chapa');
        }
    }

    /**
     * Verify a payment via Chapa.
     */
    static async verifyPayment(tx_ref: string) {
        await dbConnect();

        const transaction = await Transaction.findOne({ referenceId: tx_ref });
        if (!transaction) {
            throw new Error('Transaction not found');
        }

        if (transaction.status === 'completed') {
            return { success: true, message: 'Payment already verified' };
        }

        const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

        if (!CHAPA_SECRET_KEY) {
            // Mock verification logic
            transaction.status = 'completed';
            transaction.paymentDate = new Date();
            await transaction.save();

            // Activate or renew the subscription
            await this.handleSubscriptionActivation(transaction);

            return { success: true, message: 'Payment verified (Mock)' };
        }

        try {
            const response = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${CHAPA_SECRET_KEY}`
                }
            });

            const data = await response.json();

            if (data.status === 'success') {
                transaction.status = 'completed';
                transaction.paymentDate = new Date();
                transaction.metadata = new Map(Object.entries(data.data || {}));
                await transaction.save();

                // Activate or renew the subscription
                await this.handleSubscriptionActivation(transaction);

                // Send notification
                const plan = await SubscriptionPlan.findById(transaction.subscriptionPlanId);
                await NotificationService.create({
                    userId: transaction.userId.toString(),
                    storeId: transaction.storeId.toString(),
                    type: 'payment_success',
                    title: 'Subscription Successful',
                    message: `You have successfully subscribed to the ${plan.planName} plan. Your features are now active!`,
                    metadata: { planCode: plan.planCode, txRef: tx_ref }
                });

                return { success: true, message: 'Payment verified and subscription activated' };
            } else {
                transaction.status = 'failed';
                await transaction.save();
                throw new Error('Chapa verification failed');
            }
        } catch (error) {
            console.error('Chapa Verification Error:', error);
            throw new Error('Failed to verify payment with Chapa');
        }
    }

    /**
     * Internal logic to update the UserSubscription model.
     */
    private static async handleSubscriptionActivation(transaction: any) {
        const plan = await SubscriptionPlan.findById(transaction.subscriptionPlanId);
        if (!plan) throw new Error('Plan not found');

        const durationMonths = (plan as any).durationMonths || 1;

        const periodEnd = new Date();
        periodEnd.setMonth(periodEnd.getMonth() + durationMonths);

        await UserSubscription.findOneAndUpdate(
            { storeId: transaction.storeId },
            {
                userId: transaction.userId,
                storeId: transaction.storeId,
                planId: transaction.subscriptionPlanId,
                status: 'active',
                billingCycle: transaction.billingCycle,
                currentPeriodStart: new Date(),
                currentPeriodEnd: periodEnd
            },
            { upsert: true, new: true }
        );
    }
}
