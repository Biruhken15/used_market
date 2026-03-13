"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "../dashboard/product-card";

/**
 * RelatedProducts Component
 * Fetches and displays other products from the same store.
 */
interface RelatedProductsProps {
    storeId: string;
    excludeProductId: string;
}

export const RelatedProducts = ({ storeId, excludeProductId }: RelatedProductsProps) => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            if (!storeId) return;
            try {
                const res = await fetch(`/api/stores/${storeId}/products`);
                const data = await res.json();
                // Filter out the current product
                const filtered = data.filter((p: any) => p._id !== excludeProductId);
                setProducts(filtered);
            } catch (error) {
                console.error("Error fetching related products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRelated();
    }, [storeId, excludeProductId]);

    if (loading) return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-[4/5] bg-slate-50 animate-pulse rounded-[1.5rem]" />
            ))}
        </div>
    );

    if (products.length === 0) return null;

    return (
        <div className="space-y-8 pt-12 border-t border-slate-50">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">More from this Seller</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scalable inventory you might love</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.slice(0, 4).map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};
