export const dynamic = 'force-dynamic';

import { StoreService } from "@/lib/services/store-service";
import { FeatureBar } from "@/components/home/FeatureBar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Professional Brokers | Ethiopia\'s Largest Used Marketplace',
    description: 'Find and connect with verified professional brokers and agents in Ethiopia. High-quality used products from trusted sellers.',
};

export default async function BrokersPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const { page: pageStr } = await searchParams;
    const page = parseInt(pageStr || '1');
    const { brokers, total, pages } = await StoreService.getBrokers(page, 10);

    return (
        <div className="min-h-screen bg-slate-100 pt-28">
            <FeatureBar />
            <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase">
                            Professional Brokers 🤝
                        </h1>
                        <p className="text-slate-500 font-bold">
                            Connect with {total} verified professional agents and businesses.
                        </p>
                    </div>

                    {brokers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {brokers.map((broker: any) => {
                                const firstLetter = broker.sellerName ? broker.sellerName.charAt(0).toUpperCase() : '?';
                                const planColor = 
                                    broker.planName?.toLowerCase().includes('enterprise') ? 'bg-indigo-500' :
                                    broker.planName?.toLowerCase().includes('pro') ? 'bg-purple-500' :
                                    broker.planName?.toLowerCase().includes('basic') ? 'bg-blue-500' :
                                    'bg-slate-400';

                                return (
                                    <Link key={broker._id} href={`/stores/${broker.storeSlug}`}>
                                        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group flex items-center justify-between gap-4 cursor-pointer overflow-hidden border-b-4 border-b-slate-100 hover:border-b-accent">
                                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                                <div className="w-14 h-14 rounded-full bg-slate-950 flex items-center justify-center text-white text-xl font-black shrink-0 transition-transform group-hover:scale-105 shadow-lg">
                                                    {firstLetter}
                                                </div>
                                                <div className="flex-1 min-w-0 space-y-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="text-base font-black text-slate-900 truncate uppercase tracking-tight">
                                                            {broker.sellerName}
                                                        </h3>
                                                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 text-white rounded-full ${planColor} shadow-sm`}>
                                                            {broker.planName || 'Free Trial'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate">
                                                        {broker.storeName}
                                                    </p>
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <div className="flex items-center gap-1 text-slate-400">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                                            <span className="text-[10px] font-bold uppercase truncate">
                                                                {broker.city}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            {broker.category?.slice(0, 1).map((cat: string) => (
                                                                <span key={cat} className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-50 text-slate-500 rounded border border-slate-100 italic">
                                                                    {cat}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 text-slate-300 group-hover:bg-accent/10 group-hover:text-accent transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-20 text-center border border-slate-200">
                            <p className="text-slate-400 font-bold text-xl">No brokers found at the moment.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {pages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <Link 
                                href={`/brokers?page=${Math.max(1, page - 1)}`}
                                className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${page <= 1 ? 'bg-slate-50 text-slate-300 pointer-events-none' : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                            >
                                Previous
                            </Link>
                            <span className="font-black text-sm text-slate-400">
                                Page <span className="text-slate-900">{page}</span> of {pages}
                            </span>
                            <Link 
                                href={`/brokers?page=${Math.min(pages, page + 1)}`}
                                className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${page >= pages ? 'bg-slate-50 text-slate-300 pointer-events-none' : 'bg-slate-900 text-white shadow-xl hover:bg-black'}`}
                            >
                                Next
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
