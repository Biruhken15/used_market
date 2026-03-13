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
                setProduct(data);
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
                        />

                        {/* Seller/Store Info with Specific Labels and Contacts */}
                        <ProductSellerCard
                            store={product.storeId}
                            productTitle={product.title}
                            productPrice={product.price}
                            pageUrl={typeof window !== 'undefined' ? window.location.href : ''}
                        />
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
