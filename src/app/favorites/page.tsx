"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/common/navbar";
import { ProductCard } from "@/components/dashboard/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FavoritesPage() {
    const { data: session, status } = useSession();
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFavorites = async () => {
        try {
            const res = await fetch("/api/favorites");
            const data = await res.json();
            if (res.ok) {
                setFavorites(data.favorites || []);

                // If there are unread favorites, mark them all as read now
                if (data.unreadCount > 0) {
                    await fetch("/api/favorites", { method: 'PATCH' });
                    // Dispatch event to clear navbar count
                    window.dispatchEvent(new Event('favoritesUpdated'));
                }
            }
        } catch (error) {
            console.error("Error fetching favorites:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated") {
            fetchFavorites();
        } else if (status === "unauthenticated") {
            setLoading(false);
        }
    }, [status]);

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-slate-50/30">
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 pt-48 text-center space-y-6">
                    <div className="text-6xl text-slate-200">🔒</div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Please Log In</h1>
                    <p className="text-slate-500 max-w-md mx-auto">You need to be logged in to view your favorite products and notifications.</p>
                    <Link href="/auth/login">
                        <Button className="!h-14 !px-12 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-200">
                            Log In Now
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-32">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-40">
                {/* Header Section */}
                <div className="mb-12 space-y-4">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-accent transition-colors group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1"><path d="m15 18-6-6 6-6" /></svg>
                        Back to Marketplace
                    </Link>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-rose-50 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-rose-100">
                                Saved Items
                            </span>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
                            Your Favorites
                        </h1>
                        <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">
                            {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved to your collection
                        </p>
                    </div>
                </div>

                {/* Content Grid */}
                {favorites.length === 0 ? (
                    <div className="py-32 text-center space-y-6 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                        <div className="text-6xl text-slate-200">💝</div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Your collection is empty</h3>
                            <p className="text-slate-400 text-sm font-medium">Start exploring the marketplace and save items you love!</p>
                        </div>
                        <Link href="/dashboard">
                            <Button className="!h-14 !px-12 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-accent transition-all">
                                Explore Marketplace
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {favorites.map((fav: any) => (
                            <ProductCard
                                key={fav._id}
                                product={fav.productId}
                                initialIsFavorited={true}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
