import React from 'react';
import ProductForm from '@/components/seller/ProductForm';
import { Navbar } from '@/components/common/navbar';
import Product from '@/lib/models/product';
import dbConnect from '@/lib/db/mongoose';
import { StoreService } from '@/lib/services/store-service';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/auth";

export const metadata = {
    title: 'Edit Product | Used Market',
    description: 'Update your existing product listing.',
};

async function getProduct(id: string) {
    await dbConnect();
    const product = await Product.findById(id);
    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) redirect("/auth/login");

    const product = await getProduct(params.id);
    if (!product) {
        notFound();
    }

    // Ownership check
    if (product.ownerId !== session.user.id && session.user.role !== 'admin') {
        redirect("/seller/mystore");
    }

    // Get store info
    const store = await StoreService.getStoreById(product.storeId);

    // Get plan limits
    const { SubscriptionService } = await import('@/lib/services/subscription-service');
    const plan = await SubscriptionService.getStoreSubscription(product.storeId);
    
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
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-2">Edit <span className="text-blue-600">Listing</span></h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Marketplace Inventory • {plan?.planName || 'Free'} Plan</p>
                </header>

                <ProductForm
                    isEditing
                    product={product}
                    storeId={store?._id.toString()}
                    planLimits={JSON.parse(JSON.stringify(rawPlanLimits))}
                />
            </div>
        </main>
    );
}
