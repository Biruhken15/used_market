"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { SearchFilter } from "@/components/dashboard/search-filter";
import { ProductGrid } from "@/components/dashboard/product-grid";

export default function Dashboard() {
    const { data: session } = useSession();
    const [store, setStore] = useState<any>(null);
    const [allStores, setAllStores] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<"products" | "stores">("products");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Parallelize fetch calls
                const [storesRes, userStoreRes] = await Promise.all([
                    fetch("/api/stores?all=true"),
                    session ? fetch("/api/stores") : Promise.resolve(null)
                ]);

                const storesData = await storesRes.json();
                if (storesData.stores) setAllStores(storesData.stores);

                if (userStoreRes) {
                    const data = await userStoreRes.json();
                    if (data.store) setStore(data.store);
                }

            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [session]);

    return (
        <div className="w-full pb-20 bg-slate-50/30">
            {/* Search & Tabs Section */}
            <div className="bg-white border-b border-slate-100 pt-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tighter mb-2">Marketplace</h1>
                            <p className="text-slate-500 font-medium">Discover quality products and verified stores across Ethiopia.</p>
                        </div>
                        <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl">
                            <button
                                onClick={() => setActiveTab("products")}
                                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'products' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Products
                            </button>
                            <button
                                onClick={() => setActiveTab("stores")}
                                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'stores' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Stores
                            </button>
                        </div>
                    </div>
                    <SearchFilter />
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {activeTab === "products" ? (
                    <ProductGrid />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {allStores.map((s) => (
                            <Link key={s._id} href={`/stores/${s.storeSlug}`} className="premium-card p-6 bg-white hover:border-accent transition-all group">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl shadow-inner group-hover:bg-accent/5 group-hover:scale-105 transition-all">
                                        {s.logo?.url ? <img src={s.logo.url} alt={s.storeName} className="w-full h-full object-cover rounded-2xl" /> : "🏪"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-extrabold text-slate-900 truncate group-hover:text-accent transition-colors">{s.storeName}</h3>
                                        <p className="text-sm font-bold text-slate-400">@{s.sellerName}</p>
                                    </div>
                                </div>
                                <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
                                    {s.description}
                                </p>
                                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                                    <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-wider">{s.city}</span>
                                    <span className="px-3 py-1 bg-accent/5 text-accent text-[10px] font-bold rounded-lg uppercase tracking-wider">Verified</span>
                                </div>
                            </Link>
                        ))}
                        {allStores.length === 0 && !loading && (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-slate-400 font-bold">No stores found yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Action Section - Refined for Guest vs Logged In */}
            <div className="max-w-7xl mx-auto px-6 mt-12 pb-24">
                <div className="bg-slate-900 rounded-[3rem] p-12 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-[1.1]">
                                {session ? "Scale your business with Us." : "Join the professional marketplace."}
                            </h2>
                            <p className="text-slate-400 text-lg font-medium mb-10 leading-relaxed max-w-lg">
                                {session
                                    ? "Manage your listings, analyze store performance, and reach thousands of buyers across the country."
                                    : "Start trading today to access exclusive products, follow your favorite stores, and open your own digital shop."}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                {session ? (
                                    <>
                                        <Link href={store ? "/listings/create" : "/stores/create"}>
                                            <Button className="bg-accent text-white hover:bg-accent-dark px-10 h-14 rounded-2xl font-bold shadow-xl shadow-accent/20 border-none w-full sm:w-auto transition-transform hover:scale-105 active:scale-95">
                                                Post New Listing
                                            </Button>
                                        </Link>
                                        <Link href={store ? `/seller/mystore` : "/stores/create"}>
                                            <Button variant="outline" className="border-2 border-slate-700 hover:border-white text-white hover:bg-white/5 px-10 h-14 rounded-2xl font-bold transition-all w-full sm:w-auto">
                                                {store ? "Manage My Store" : "Create Store Profile"}
                                            </Button>
                                        </Link>
                                    </>
                                ) : (
                                    <Link href="/auth/register">
                                        <Button className="bg-accent text-white hover:bg-accent-dark px-12 h-16 text-lg rounded-2xl font-black shadow-2xl shadow-accent/30 border-none w-full sm:w-auto transition-all hover:scale-105 active:scale-95">
                                            Start Your Journey
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="hidden lg:flex justify-end">
                            <div className="w-64 h-64 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center text-9xl shadow-2xl shadow-black/20">
                                👜
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
