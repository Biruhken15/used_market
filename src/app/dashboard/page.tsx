"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

import { SearchFilter } from "@/components/dashboard/search-filter";
import { ProductGrid } from "@/components/dashboard/product-grid";

export default function Dashboard() {
    const { data: session } = useSession();
    const [store, setStore] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkStore = async () => {
            try {
                const res = await fetch("/api/stores");
                const data = await res.json();
                if (data.store) {
                    setStore(data.store);
                }
            } catch (err) {
                console.error("Error checking store:", err);
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            checkStore();
        }
    }, [session]);

    return (
        <div className="w-full pb-20">
            {/* Search & Filter Section */}
            <SearchFilter />

            {/* Product Listing Section */}
            <ProductGrid />

            {/* Action Section - Senior Refined */}
            <div className="max-w-7xl mx-auto px-4 mt-12 pb-24">
                <div className="bg-slate-900 rounded-[2.5rem] p-12 md:p-16 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-tight">
                                Professional tools for <br />Ethiopian traders.
                            </h2>
                            <p className="text-slate-400 text-lg font-medium mb-10 leading-relaxed max-w-lg">
                                Scale your business with advanced listing tools, store analytics, and priority customer support.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href={store ? "/listings/create" : "/stores/create"}>
                                    <Button className="bg-blue-600 text-white hover:bg-blue-700 px-10 py-4 text-base rounded-xl font-bold shadow-xl shadow-blue-900/40 border-none w-full sm:w-auto">
                                        Post New Listing
                                    </Button>
                                </Link>
                                <Link href={store ? `/store/${store.storeSlug}` : "/stores/create"}>
                                    <Button variant="outline" className="border-2 border-slate-700 hover:border-white text-white hover:bg-white/5 px-10 py-4 text-base rounded-xl font-bold transition-all w-full sm:w-auto">
                                        {store ? "Manage My Store" : "Create Store Profile"}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="hidden lg:flex justify-end">
                            <div className="w-56 h-56 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center text-8xl shadow-2xl">
                                🏪
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
