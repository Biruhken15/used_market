"use client";

import { Navbar } from "@/components/common/navbar";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductEssentials } from "@/components/products/product-essentials";
import { ProductSellerCard } from "@/components/products/product-seller-card";
import { RelatedProducts } from "@/components/products/related-products";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MobileProductActions } from "@/components/products/MobileProductActions";

interface ProductDetailsClientProps {
    product: any;
    isOwner?: boolean;
}

export default function ProductDetailsClient({ product, isOwner = false }: ProductDetailsClientProps) {
    const router = useRouter();

    useEffect(() => {
        // Trigger viewed notification
        fetch('/api/notifications/trigger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'product_viewed', productId: product._id })
        }).catch(err => console.error("Failed to trigger view notification:", err));
    }, [product._id]);

    return (
        <div className="min-h-screen bg-white pb-32">
            <Navbar />

            {/* Top Navigation Bar */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 md:pt-32">
                <button
                    onClick={() => router.back()}
                    className="group mb-8 md:mb-12 flex items-center gap-2 text-slate-400 hover:text-accent transition-colors"
                >
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:border-accent/20 group-hover:bg-accent/5 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </div>
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest mt-0.5">Back to Marketplace</span>
                </button>

                {/* Main Product Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-10 items-start">

                    {/* Left: Product Media Gallery */}
                    <div className="lg:col-span-6">
                        <ProductGallery
                            images={product.images || []}
                            title={product.title}
                        />
                    </div>

                    {/* Right: Product Info & Seller Contact */}
                    <div className="lg:col-span-4 space-y-10">
                        <ProductEssentials
                            productId={product._id}
                            ownerId={product.ownerId}
                            title={product.title}
                            price={product.price}
                            status={product.status}
                            category={product.category}
                            description={product.description}
                            priceType={product.priceType}
                            condition={product.condition}
                            location={product.city || product.storeId?.city || "Addis Ababa"}
                        />

                        <div className="hidden lg:block">
                            <ProductSellerCard
                                store={product.storeId}
                                productTitle={product.title}
                                productPrice={product.price}
                                pageUrl={typeof window !== 'undefined' ? window.location.href : ''}
                            />
                        </div>

                        {product.sourceOwner && (
                            <div className="p-8 rounded-[2.5rem] bg-white border-2 border-slate-100 space-y-6 shadow-sm relative overflow-hidden">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 relative z-10">
                                    <div className="space-y-1">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 italic">Product Owner Info</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Confidential Broker View</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
                                    </div>
                                </div>

                                <div className="space-y-6 relative z-10">
                                    {product.sourceOwner.name && (
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Owner Identity</p>
                                            <p className="text-lg font-black tracking-tight italic uppercase text-slate-900">{product.sourceOwner.name}</p>
                                        </div>
                                    )}

                                    {product.sourceOwner.phone && (
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Contact Protocol</p>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-3">
                                                    <p className="text-base font-black tracking-widest text-blue-600">{product.sourceOwner.phone}</p>
                                                    <a href={`tel:${product.sourceOwner.phone}`} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-slate-600">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {!isOwner && (
                    <div className="mt-32">
                        <RelatedProducts
                            storeId={product.storeId?._id}
                            excludeProductId={product._id}
                        />
                    </div>
                )}
            </div>

            <MobileProductActions 
                store={product.storeId}
                productTitle={product.title}
                productPrice={product.price}
            />
        </div>
    );
}
