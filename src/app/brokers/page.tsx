import { StoreService } from "@/lib/services/store-service";
import { FeatureBar } from "@/components/home/FeatureBar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function BrokersPage() {
    const brokers = await StoreService.getBrokers();

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
                            Connect with verified professional agents and businesses.
                        </p>
                    </div>

                    {brokers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {brokers.map((broker: any) => (
                                <div key={broker._id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                                    <div className="flex gap-6 items-start">
                                        <div className="w-24 h-24 rounded-2xl bg-slate-50 flex-shrink-0 overflow-hidden border border-slate-100">
                                            {broker.logo?.url ? (
                                                <img src={broker.logo.url} alt={broker.storeName} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-3xl">🏢</div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex flex-col">
                                                <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase italic truncate">
                                                    {broker.storeName}
                                                </h3>
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">
                                                    {broker.sellerName}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {broker.category?.slice(0, 3).map((cat: string) => (
                                                    <span key={cat} className="text-[9px] font-black uppercase tracking-tighter px-2 py-1 bg-slate-100 text-slate-500 rounded-md">
                                                        {cat}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="pt-4 flex items-center justify-between">
                                                <div className="flex items-center gap-1.5 text-slate-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                                    <span className="text-[10px] font-bold uppercase truncate max-w-[150px]">
                                                        {broker.city}{broker.region ? `, ${broker.region}` : ''}, {broker.country}
                                                    </span>
                                                </div>
                                                <Link href={`/stores/${broker.storeSlug}`}>
                                                    <Button variant="outline" className="rounded-xl font-black uppercase text-[10px] border-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                                                        Visit Store
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-20 text-center border border-slate-200">
                            <p className="text-slate-400 font-bold text-xl">No brokers found at the moment.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
