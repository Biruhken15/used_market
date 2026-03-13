import React from 'react';
import ProductForm from '@/components/seller/ProductForm';
import { Navbar } from '@/components/common/navbar';
import Product from '@/lib/models/product';
import dbConnect from '@/lib/db/mongoose';
import { StoreService } from '@/lib/services/store-service';
import { notFound } from 'next/navigation';

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
    const product = await getProduct(params.id);

    if (!product) {
        notFound();
    }

    // Get store info for the form context
    const store = await StoreService.getStoreById(product.storeId);

    // Get plan limits for the form
    const { SubscriptionService } = await import('@/lib/services/subscription-service');
    const plan = await SubscriptionService.getStoreSubscription(product.storeId);
    const planLimits = plan?.planId?.limits;

    return (
        <main className="min-h-screen bg-[#fcfcfc]">
            <Navbar />
            <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
                <header className="mb-12 text-center md:text-left">
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-2">Edit <span className="text-blue-600">Listing</span></h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Refine Item Details</p>
                </header>

                <ProductForm
                    initialData={product}
                    isEditing={true}
                    productId={product._id}
                    storeId={product.storeId}
                    storeSlug={store?.storeSlug}
                    planLimits={planLimits}
                />
            </div>
        </main>
    );
}
