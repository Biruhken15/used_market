import React from 'react';
import ProductForm from '@/components/seller/ProductForm';
import { Navbar } from '@/components/common/navbar';
import Product from '@/lib/models/product';
import dbConnect from '@/lib/db/mongoose';
import { StoreService } from '@/lib/services/store-service';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/utils/auth";
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Edit Product | KesewEj',
    description: 'Update your existing product listing.',
};

async function getProduct(id: string) {
    await dbConnect();
    const product = await Product.findById(id);
    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) redirect("/auth/login");

    const { id } = await params;
    const product = await getProduct(id);
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
                <Link href="/seller/mystore" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors mb-8 group">
                    <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest mt-0.5">Back to Inventory</span>
                </Link>
                
                <header className="mb-12 text-center md:text-left">
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-2">Edit <span className="text-blue-600">Listing</span></h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">KesewEj Inventory • {plan?.planName || 'Free'} Plan</p>
                </header>

                <ProductForm
                    isEditing
                    initialData={product}
                    productId={product._id}
                    storeId={store?._id.toString()}
                    storeSlug={store?.storeSlug}
                    planLimits={JSON.parse(JSON.stringify(rawPlanLimits))}
                />
            </div>
        </main>
    );
}
