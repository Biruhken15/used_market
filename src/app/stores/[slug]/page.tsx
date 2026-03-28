"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/common/navbar";
import { StoreReviews } from "@/components/store/StoreReviews";
import { StoreReviewForm } from "@/components/store/StoreReviewForm";
import { ProductCard } from "@/components/dashboard/product-card";
import Link from "next/link";

/**
 * StoreProfilePage - Public view of a store and its products.
 */
export default function StoreProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [store, setStore] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                // Since we only have /api/stores which returns either all or user's store,
                // we'll fetch all and filter for now, or assume an API update is coming.
                // BEST PRACTICE: API should support /api/stores/slug/[slug]
                const res = await fetch(`/api/stores?all=true`);
                const data = await res.json();
                const foundStore = data.stores?.find((s: any) => s.storeSlug === params.slug);

                if (foundStore) {
                    setStore(foundStore);

                    // Trigger visited notification
                    fetch('/api/notifications/trigger', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type: 'store_visited', storeId: foundStore._id })
                    }).catch(err => console.error("Failed to trigger visit notification:", err));

                    // Fetch products for this store
                    const prodRes = await fetch(`/api/stores/${foundStore._id}/products`);
                    const prodData = await prodRes.json();
                    setProducts(prodData);

                    // Fetch reviews for this store
                    const reviewRes = await fetch(`/api/stores/${foundStore._id}/reviews`);
                    if (reviewRes.ok) {
                        const reviewData = await reviewRes.json();
                        setStore((prev: any) => ({ ...prev, reviews: reviewData }));
                    }
                }
            } catch (error) {
                console.error("Error fetching store data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStoreData();
    }, [params.slug]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
    );

    if (!store) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
            <div className="text-6xl text-slate-200">🏪</div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Store not found</h2>
            <button onClick={() => router.push('/dashboard')} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-accent transition-colors">
                Back to Marketplace
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/30 pb-32">
            <Navbar />

            {/* Hero / Branding Section */}
            <div className="relative h-80 md:h-[450px] w-full bg-slate-200 overflow-hidden pt-20">
                {store.coverImage?.url ? (
                    <img src={store.coverImage.url} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-slate-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative -mt-20 md:-mt-32 z-10">
                <div className="bg-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-16 shadow-2xl shadow-slate-200/50 border border-slate-100">
                    <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-start lg:items-end mb-12 md:mb-16">
                        <div className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-2xl md:rounded-[3rem] border-4 md:border-8 border-white -mt-16 md:-mt-24 shadow-2xl overflow-hidden shrink-0">
                            {store.logo?.url ? (
                                <img src={store.logo.url} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-4xl md:text-6xl">🏪</div>
                            )}
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="flex flex-wrap items-center gap-4">
                                <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">{store.storeName}</h1>
                                <span className="px-4 py-1.5 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-full border border-accent/20">Verified Merchant</span>
                            </div>
                            <div className="relative w-full max-w-full overflow-hidden">
                                <p className="text-slate-500 text-lg font-medium max-w-2xl leading-relaxed whitespace-pre-line break-words">
                                    {(store.description?.length > 200 && !isDescriptionExpanded)
                                        ? `${store.description.slice(0, 200)}...`
                                        : store.description}
                                </p>
                                {store.description?.length > 200 && (
                                    <button
                                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                        className="mt-2 text-accent text-xs font-black uppercase tracking-widest hover:underline"
                                    >
                                        {isDescriptionExpanded ? 'See Less' : 'See More'}
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-6 pt-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-400">📍</span>
                                    <span className="text-sm font-bold text-slate-600">{store.city}, {store.country}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-400">📦</span>
                                    <span className="text-sm font-bold text-slate-600">{products.length} Products</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 border-t border-slate-100 pt-12 md:pt-16">
                        {/* Left: Products */}
                        <div className="lg:col-span-12 space-y-8 md:space-y-12">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Merchant Inventory</h2>
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
                                {products.map((p) => (
                                    <ProductCard key={p._id} product={p} />
                                ))}
                            </div>
                            {products.length === 0 && (
                                <div className="py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active listings currently available.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Trust Section: Reviews */}
                    <div className="mt-16 md:mt-24 border-t border-slate-100 pt-16 md:pt-24">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">
                            <div className="space-y-8 md:space-y-12">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-4 italic uppercase">Merchant Feedback</h2>
                                    <p className="text-slate-500 font-medium text-sm md:text-base">Verify the credibility of this merchant through buyer experiences.</p>
                                </div>
                                <StoreReviews reviews={store.reviews || []} storeName={store.storeName} />
                            </div>
                            <div className="lg:sticky lg:top-32">
                                <StoreReviewForm storeId={store._id} storeName={store.storeName} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
