import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/auth";
import { redirect } from "next/navigation";
import { StoreService } from "@/lib/services/store-service";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function MyStorePage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/auth/login");
    }

    const store = await StoreService.getStoreByOwner(session.user.id);

    if (!store) {
        redirect("/stores/create");
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-24">
            {/* Store Header / Branding */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden bg-slate-200">
                {store.coverImage?.url ? (
                    <img
                        src={store.coverImage.url}
                        alt="Store Cover"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-700 opacity-20" />
                )}
                <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="max-w-5xl mx-auto px-6 relative">
                {/* Store Profile Section */}
                <div className="flex flex-col md:flex-row items-end gap-8 -mt-20 relative z-10">
                    <div className="w-40 h-40 bg-white border-8 border-white rounded-[3rem] shadow-2xl overflow-hidden shrink-0">
                        {store.logo?.url ? (
                            <img
                                src={store.logo.url}
                                alt="Store Logo"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-5xl">
                                🏪
                            </div>
                        )}
                    </div>
                    <div className="flex-1 pb-4 space-y-3">
                        <div className="flex flex-wrap items-center gap-4">
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                                {store.storeName}
                            </h1>
                            <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-200">
                                Verified Store
                            </span>
                        </div>
                        <p className="text-slate-500 font-bold text-base flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            {store.category} • {store.city}, {store.country}
                        </p>
                    </div>
                </div>

                {/* Dashboard Actions */}
                <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-slate-200">
                    <div className="flex items-center gap-10">
                        {["Inventory", "Analytics", "Settings"].map((tab, i) => (
                            <button
                                key={tab}
                                className={`pb-4 text-sm font-black uppercase tracking-[0.2em] transition-all border-b-2 ${i === 0 ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <Link href="/seller/mystore/add-product">
                        <Button className="h-14 px-10 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                            Add Product
                        </Button>
                    </Link>
                </div>

                {/* Main Content Area */}
                <div className="py-20">
                    {/* Simplified Empty State */}
                    <div className="bg-white rounded-[4rem] p-16 md:p-24 border border-slate-100 shadow-sm text-center space-y-12">
                        <div className="max-w-sm mx-auto space-y-8">
                            <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center text-6xl mx-auto shadow-inner transform -rotate-6">
                                📦
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">No Products Yet.</h2>
                                <p className="text-slate-400 font-bold text-lg leading-relaxed">
                                    Your inventory is currently empty. Ready to start selling?
                                </p>
                            </div>

                            <Link href="/seller/mystore/add-product" className="inline-block pt-4">
                                <Button className="h-16 px-12 rounded-[2rem] bg-blue-600 text-white font-black text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100 border-none group">
                                    <span className="flex items-center gap-4">
                                        Post First Listing
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="translate-x-0 group-hover:translate-x-1 transition-transform font-black"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                                    </span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
