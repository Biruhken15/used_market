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

export default async function AddProductPage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) redirect("/auth/login");

    const store = await StoreService.getStoreByOwner(session.user.id);
    if (!store) redirect("/stores/create");

    const subscription = await SubscriptionService.getStoreSubscription(store._id.toString());
    const plan = subscription?.planId as any;

    const rawPlanLimits = plan ? {
        ...plan.limits,
        planCode: plan.planCode,
        canMarkAsUrgent: plan.features?.canMarkAsUrgent,
        canMarkAsFeatured: (plan.limits?.featuredListingsPerMonth || 0) > 0
    } : { maxActiveListings: 3, imagesPerProduct: 3 };

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
                    planLimits={JSON.parse(JSON.stringify(rawPlanLimits))}
                />
            </div>
        </main>
    );
}
