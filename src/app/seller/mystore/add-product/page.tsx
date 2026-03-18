import React from 'react';
import ProductForm from '@/components/seller/ProductForm';
import { Navbar } from '@/components/common/navbar';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/auth";
import { redirect } from "next/navigation";
import { StoreService } from "@/lib/services/store-service";
import { SubscriptionService } from "@/lib/services/subscription-service";

export const metadata = {
    title: 'Add Product | Used Market',
    description: 'List a new product for sale in the marketplace.',
};

export default async function AddProductPage({ searchParams }: { searchParams: { planCode?: string, planId?: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) redirect("/auth/login");

    let store = await StoreService.getStoreByOwner(session.user.id);
    const planCode = searchParams.planCode;

    if (!store) {
        if (planCode === 'PAY_PER_PRODUCT') {
            // Auto-create a "Personal Store" for Pay-Per-Product flow
            store = await StoreService.ensureUserHasStore(
                session.user.id,
                session.user.name || "Seller",
                "", // Phone placeholder, can be updated later
                session.user.email || ""
            );
        } else {
            redirect("/stores/create");
        }
    }

    // Fetch the plan limits
    let plan: any = null;
    const planCode = searchParams.planCode;

    if (planCode === 'PAY_PER_PRODUCT') {
        // If in Solo Flow, use the PAY_PER_PRODUCT plan limits directly
        plan = await SubscriptionService.getPlan('PAY_PER_PRODUCT');
    } else {
        // Otherwise use the store's active subscription
        const subscription = await SubscriptionService.getStoreSubscription(store._id.toString());
        plan = subscription?.planId as any;
    }

    return (
        <main className="min-h-screen bg-[#fcfcfc]">
            <Navbar />
            <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
                <header className="mb-12 text-center md:text-left">
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-2">Post <span className="text-blue-600">New Listing</span></h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Marketplace Inventory • {plan?.planName || 'Free'} Plan</p>
                </header>

                <ProductForm
                    storeId={store._id.toString()}
                    planLimits={JSON.parse(JSON.stringify(plan?.limits || { maxActiveListings: 3, imagesPerProduct: 3 }))}
                />
            </div>
        </main>
    );
}
