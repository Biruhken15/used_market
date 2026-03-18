"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/common/navbar";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductEssentials } from "@/components/products/product-essentials";
import { ProductSellerCard } from "@/components/products/product-seller-card";
import { RelatedProducts } from "@/components/products/related-products";

/**
 * ProductDetailPage - Main container for the product viewed by users.
 * Refactored into modular components for scalability and clarity.
 */
export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();

    // State
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Fetch Product Data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Fetch product with populated store info
                const res = await fetch(`/api/products/${params.id}`);
                const data = await res.json();

                // Check if this product's store has a PAY_PER_PRODUCT plan
                const subRes = await fetch(`/api/subscriptions/store/${data.storeId?._id}`);
                const subData = await subRes.json();

                setProduct({
                    ...data,
                    isPayPerProduct: subData?.planId?.planCode === 'PAY_PER_PRODUCT'
                });
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [params.id]);

    // Loading State
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
    );

    // Not Found State
    if (!product) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
            <div className="text-6xl text-slate-200">🔍</div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Product not found</h2>
            <button
                onClick={() => router.back()}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-accent transition-colors"
            >
                Go Back
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-white pb-32">
            <Navbar />

            {/* Top Navigation Bar */}
            <div className="max-w-7xl mx-auto px-6 pt-32">
                <button
                    onClick={() => router.back()}
                    className="group mb-12 flex items-center gap-2 text-slate-400 hover:text-accent transition-colors"
                >
                    <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:border-accent/20 group-hover:bg-accent/5 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest mt-0.5">Back to Marketplace</span>
                </button>

                {/* Main Product Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* Left: Product Media Gallery */}
                    <div className="lg:col-span-7">
                        <ProductGallery
                            images={product.images || []}
                            title={product.title}
                        />
                    </div>

                    {/* Right: Product Info & Seller Contact */}
                    <div className="lg:col-span-5 space-y-12">
                        {/* Essential Info (Title, Price, Badges, Description) */}
                        <ProductEssentials
                            title={product.title}
                            price={product.price}
                            status={product.status}
                            category={product.category}
                            description={product.description}
                            priceType={product.priceType}
                            condition={product.condition}
                            location={product.city || product.storeId?.city || "Addis Ababa"}
                            isUrgent={product.isUrgent}
                            isFeatured={product.isFeatured}
                        />

                        {/* Seller/Store Info with Specific Labels and Contacts */}
                        <ProductSellerCard
                            store={product.storeId}
                            productTitle={product.title}
                            productPrice={product.price}
                            pageUrl={typeof window !== 'undefined' ? window.location.href : ''}
                        />

                        {/* Source Owner Info - Only Visible to Store Owner */}
                        {product.sourceOwner && (
                            <div className="p-8 rounded-[2.5rem] bg-white border-2 border-slate-100 space-y-6 shadow-sm relative overflow-hidden">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 relative z-10">
                                    <div className="space-y-1">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 italic">Seller Information</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{product.isPayPerProduct ? 'Verified Individual Contact' : 'Confidential Broker View'}</p>
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
                                                {product.sourceOwner.telegram && (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                                                        </div>
                                                        <p className="text-xs font-black tracking-widest text-slate-400 lowercase italic">{product.sourceOwner.telegram}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {product.sourceOwner.address && (
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Physical Location</p>
                                            <p className="text-xs font-bold text-slate-600 leading-relaxed italic">{product.sourceOwner.address}</p>
                                        </div>
                                    )}

                                    {product.sourceOwner.otherInfo && (
                                        <div className="pt-4 border-t border-slate-100">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-2">Internal Intel</p>
                                            <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic uppercase">{product.sourceOwner.otherInfo}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products Section: More from same seller */}
                <div className="mt-32">
                    <RelatedProducts
                        storeId={product.storeId?._id}
                        excludeProductId={product._id}
                    />
                </div>
            </div>
        </div>
    );
}
