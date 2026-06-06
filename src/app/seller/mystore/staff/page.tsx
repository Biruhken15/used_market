import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/utils/auth";

export const dynamic = 'force-dynamic';
import { redirect } from "next/navigation";
import { StoreService } from "@/lib/services/store-service";
import { StaffList } from "@/components/seller/StaffList";
import { Shield } from "lucide-react";

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
    const totalStaff = serializedStaff.length;
    const pendingInvites = serializedStaff.filter((member: any) => !member.userId).length;

    return (
        <div className="min-h-screen bg-slate-50/80 pt-28 pb-20 px-4">
            <div className="max-w-6xl mx-auto space-y-10">
                <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr] items-start">
                    <div className="rounded-[2rem] bg-white border border-slate-200 p-10 shadow-sm">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-[10px] font-black uppercase tracking-[0.35em] rounded-full mb-5">
                            Staff Management
                        </span>
                        <h1 className="text-4xl font-extrabold text-slate-950 tracking-tight mb-4">Manage your team with clear access control.</h1>
                        <p className="text-slate-600 text-base leading-8 max-w-2xl">
                            Invite trusted staff, review pending access, and keep your store operations secure. This page brings your team workflow into a simple, analytics-style control center.
                        </p>
                    </div>

                    <div className="grid gap-4">
                        <div className="rounded-[2rem] bg-white border border-slate-200 p-6 shadow-sm">
                            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-slate-400 mb-3">Active Staff</p>
                            <p className="text-4xl font-black text-slate-950">{totalStaff}</p>
                            <p className="text-sm text-slate-500 mt-3">Members currently invited to manage your store.</p>
                        </div>
                        <div className="rounded-[2rem] bg-white border border-slate-200 p-6 shadow-sm">
                            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-slate-400 mb-3">Pending Invites</p>
                            <p className="text-4xl font-black text-violet-600">{pendingInvites}</p>
                            <p className="text-sm text-slate-500 mt-3">Invitations awaiting registration completion.</p>
                        </div>
                    </div>
                </section>

                <section className="rounded-[2rem] bg-white border border-slate-200 shadow-sm p-8 md:p-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-slate-400 mb-2">Team roster</p>
                            <h2 className="text-3xl font-black text-slate-950 tracking-tight">Invite, manage, and audit your store staff.</h2>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">
                            <Shield size={16} className="text-violet-600" />
                            Full administrative access
                        </div>
                    </div>

                    <StaffList storeId={store._id.toString()} staff={serializedStaff} />
                </section>

                <section className="rounded-[2rem] bg-violet-50 border border-violet-100 p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.35em] font-black text-violet-600 mb-2">Security note</p>
                            <h3 className="text-2xl font-black text-slate-950">Only invite team members you trust.</h3>
                            <p className="mt-3 text-sm text-slate-600 leading-7 max-w-2xl">
                                Staff members can manage listings, view analytics, and communicate with buyers. Keep access limited to verified members of your business and revoke permissions when roles change.
                            </p>
                        </div>
                        <div className="rounded-[1.75rem] border border-violet-200 bg-white p-5 shadow-sm">
                            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-slate-400 mb-2">Tip</p>
                            <p className="text-sm text-slate-700">Use email invites and remove old staff immediately to protect your business data.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
