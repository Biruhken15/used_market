"use client";

import { useEffect, useState, useCallback } from "react";
import { ProductCard } from "./product-card";
import { useSession } from "next-auth/react";

export const ProductGrid = () => {
    const { data: session } = useSession();
    const [products, setProducts] = useState<any[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const fetchData = useCallback(async (pageNum = 1, append = false) => {
        if (pageNum > 1) setIsFetchingMore(true);
        else setLoading(true);

        try {
            const [productsRes, favoritesRes] = await Promise.all([
                fetch(`/api/products?page=${pageNum}&limit=12`),
                session ? fetch("/api/favorites") : Promise.resolve(null)
            ]);

            const productsData = await productsRes.json();
            
            // Handle new paginated response format { products, total, page, totalPages }
            const newProducts = productsData.products || [];
            
            if (append) {
                setProducts(prev => [...prev, ...newProducts]);
            } else {
                setProducts(newProducts);
            }

            setTotalPages(productsData.totalPages || 1);
            setPage(productsData.page || pageNum);

            if (favoritesRes && favoritesRes.ok) {
                const favoritesData = await favoritesRes.json();
                setFavoriteIds(new Set(favoritesData.favorites?.map((f: any) => f.productId?._id || f.productId)));
            }
        } catch (error) {
            console.error("Failed to fetch grid data:", error);
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    }, [session]);

    useEffect(() => {
        fetchData(1, false);

        const handleRefresh = () => fetchData(1, false);
        window.addEventListener('favoritesUpdated', handleRefresh);
        return () => window.removeEventListener('favoritesUpdated', handleRefresh);
    }, [fetchData]);

    const loadMore = () => {
        if (page < totalPages) {
            fetchData(page + 1, true);
        }
    };

    if (loading && products.length === 0) {
        return (
            <div className="w-full py-24 flex justify-center">
                <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900 mb-2 italic uppercase">
                        Marketplace <span className="text-rose-600">Discover</span>
                    </h2>
                    <p className="text-slate-500 font-bold text-sm">Professional quality products from verified sellers across the SaaS platform.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        initialIsFavorited={favoriteIds.has(product._id)}
                        isLoggedIn={!!session}
                    />
                ))}
                
                {products.length === 0 && !loading && (
                    <div className="col-span-full py-24 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No listings found in this sector.</p>
                    </div>
                )}
            </div>

            {page < totalPages && (
                <div className="mt-20 text-center">
                    <button 
                        onClick={loadMore}
                        disabled={isFetchingMore}
                        className="px-12 py-4 rounded-2xl font-black text-slate-900 border-2 border-slate-100 hover:border-rose-600 transition-all shadow-sm active:scale-95 disabled:opacity-50 uppercase tracking-widest text-[10px]"
                    >
                        {isFetchingMore ? "Synchronizing..." : "Load More Products"}
                    </button>
                </div>
            )}
        </div>
    );
};
