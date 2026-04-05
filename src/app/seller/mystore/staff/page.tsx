import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/utils/auth";

export const dynamic = 'force-dynamic';
import { redirect } from "next/navigation";
import { StoreService } from "@/lib/services/store-service";
import { StaffList } from "@/components/seller/StaffList";
import Link from "next/link";

export default async function StaffManagementPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/auth/login");
    }

    const store = await StoreService.getStoreByOwner(session.user.id);

    if (!store) {
        redirect("/stores/create");
    }

    // Serialize staff data for client component
    const serializedStaff = JSON.parse(JSON.stringify(store.staff || []));

    return (
        <div className="min-h-screen bg-slate-50/50 pt-32 pb-24 px-6 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-blue-200">
                                Staff Protocol
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tighter mb-2">
                            Team Management.
                        </h1>
                        <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-xl">
                            Delegate management duties to trusted partners. Unified permissions across all store verticals.
                        </p>
                    </div>
                    <div>
                        <Link href="/seller/mystore" className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-all group">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6" /></svg>
                            Back to Store
                        </Link>
                    </div>
                </div>

                {/* Main Content */}
                <StaffList storeId={store._id.toString()} staff={serializedStaff} />

                {/* Info Footer */}
                <div className="mt-16 p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 flex flex-col md:flex-row items-center gap-8 group">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">
                        💡
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1 italic">Security Advisory</h4>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-relaxed">
                            Staff members currently receive full administrative access to your store inventory and analytics.
                            Ensure invitations are only sent to authorized representatives of your business entity.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
