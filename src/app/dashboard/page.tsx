"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { SearchFilter } from "@/components/dashboard/search-filter";
import { ProductGrid } from "@/components/dashboard/product-grid";
import PricingSection from "@/components/pricing-section";

export default function Dashboard() {
    const { data: session } = useSession();
    const [store, setStore] = useState<any>(null);
    const [allStores, setAllStores] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<"products" | "stores">("products");

    // Force products tab for guests
    useEffect(() => {
        if (!session) {
            setActiveTab("products");
        }
    }, [session]);

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
            {/* Header Section */}
            <div className="bg-white border-b border-slate-100 pt-32 pb-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 italic uppercase">Partner Stores</h1>
                            <p className="text-slate-400 font-bold text-sm">Discover and follow verified merchants across Ethiopia.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <Button variant="outline" className="h-12 px-8 rounded-xl border-2 border-slate-200 font-black text-xs uppercase tracking-widest hover:border-slate-950 transition-all">
                                    Browse Products
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allStores.map((s) => (
                        <Link key={s._id} href={`/stores/${s.storeSlug}`} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group border-2 hover:border-slate-900">
                            <div className="flex items-start gap-5 mb-8">
                                <div className="w-20 h-20 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                                    {s.logo?.url ? <img src={s.logo.url} alt={s.storeName} className="w-full h-full object-cover" /> : "🏪"}
                                </div>
                                <div className="flex-1 min-w-0 pt-1">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight truncate group-hover:text-blue-600 transition-colors uppercase italic">{s.storeName}</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Managed by {s.sellerName}</p>
                                </div>
                            </div>

                            <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2 h-10 mb-8">
                                {s.description}
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black rounded-full uppercase tracking-widest">{s.city}</span>
                                    {s.storeType === 'broker' && (
                                        <span className="px-3 py-1 bg-purple-50 text-purple-600 text-[9px] font-black rounded-full uppercase tracking-widest border border-purple-100 italic">Broker</span>
                                    )}
                                </div>
                                <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                                </span>
                            </div>
                        </Link>
                    ))}
                    {allStores.length === 0 && !loading && (
                        <div className="col-span-full py-40 text-center space-y-4">
                            <div className="text-6xl grayscale opacity-20">🏪</div>
                            <p className="text-slate-400 font-black uppercase tracking-widest text-sm italic">Establishing network...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom CTA */}
            {!store && (
                <div className="max-w-7xl mx-auto px-6 mt-12 pb-24">
                    <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 opacity-10">
                            <img src="/market-narrative-1.png" alt="Background" className="w-full h-full object-cover" />
                        </div>
                        <div className="relative z-10 space-y-8 max-w-2xl mx-auto text-white">
                            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">Become a Merchant</h2>
                            <p className="text-white/50 text-lg font-bold">Open your digital storefront and start reaching buyers across Ethiopia today.</p>
                            <Link href="/stores/create" className="inline-block">
                                <Button className="h-16 px-12 bg-white text-slate-950 hover:bg-blue-600 hover:text-white font-black text-lg rounded-2xl transition-all shadow-2xl border-none uppercase">
                                    Create My Store
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
