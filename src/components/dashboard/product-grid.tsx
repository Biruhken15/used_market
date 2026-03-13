"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "./product-card";

export const ProductGrid = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [productsRes, favoritesRes] = await Promise.all([
                fetch("/api/products"),
                fetch("/api/favorites")
            ]);

            const productsData = await productsRes.json();
            if (Array.isArray(productsData)) {
                setProducts(productsData);
            }

            if (favoritesRes.ok) {
                const favoritesData = await favoritesRes.json();
                setFavoriteIds(new Set(favoritesData.favorites.map((f: any) => f.productId?._id)));
            }
        } catch (error) {
            console.error("Failed to fetch grid data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Refresh favorite state if toggle happens outside
        window.addEventListener('favoritesUpdated', fetchData);
        return () => window.removeEventListener('favoritesUpdated', fetchData);
    }, []);

    if (loading) {
        return (
            <div className="w-full py-20 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900 mb-2">Recommended for You</h2>
                    <p className="text-slate-500 font-medium text-sm">Quality verified products from trusted Ethiopian sellers.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        initialIsFavorited={favoriteIds.has(product._id)}
                    />
                ))}
                {products.length === 0 && (
                    <div className="col-span-full py-24 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100 italic font-bold">
                        <p className="text-slate-400">No products found in the marketplace yet.</p>
                    </div>
                )}
            </div>

            {products.length > 0 && (
                <div className="mt-20 text-center">
                    <button className="px-12 py-4 rounded-2xl font-black text-slate-600 border border-slate-200 hover:bg-white hover:border-accent hover:text-accent transition-all shadow-sm active:scale-95">
                        Load More Products
                    </button>
                </div>
            )}
        </div>
    );
};
