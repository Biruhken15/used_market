"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

export default function SubscriptionsAdminPage() {
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const fetchSubscriptions = useCallback(async (p = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/subscriptions?page=${p}&limit=${PAGE_SIZE}`);
            const data = await res.json();
            if (res.ok) {
                setSubscriptions(data.subscriptions);
                setTotalPages(data.pagination.pages);
                setTotalItems(data.pagination.total);
            }
        } catch (error) {
            console.error("Failed to fetch subscriptions:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchSubscriptions(page); }, [fetchSubscriptions, page]);

    const handleStatusChange = async (subId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'canceled' : 'active';
        if (!confirm(`Forcibly ${newStatus.toUpperCase()} this subscription?`)) return;
        try {
            const res = await fetch(`/api/admin/subscriptions/${subId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) fetchSubscriptions(page);
            else alert("Failed to update subscription status");
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (subId: string) => {
        if (!confirm("DANGER: Permanently expunge this billing record? Cannot be undone.")) return;
        try {
            const res = await fetch(`/api/admin/subscriptions/${subId}`, { method: "DELETE" });
            if (res.ok) fetchSubscriptions(page);
            else alert("Failed to delete subscription");
        } catch (err) { console.error(err); }
    };

    const statusColors: Record<string, string> = {
        active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        past_due: 'bg-amber-50 text-amber-600 border-amber-100',
        canceled: 'bg-rose-50 text-rose-600 border-rose-100',
        expired: 'bg-rose-50 text-rose-600 border-rose-100',
    };

    const columns = [
        {
            header: "Plan",
            cell: (s: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-100 flex items-center justify-center text-lg flex-shrink-0">
                        💎
                    </div>
                    <div>
                        {/* planName is the correct field from the SubscriptionPlan model */}
                        <p className="font-bold text-slate-900">{s.planId?.planName || s.planId?.planCode || "Unknown Plan"}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{s.billingCycle}</p>
                    </div>
                </div>
            )
        },
        {
            header: "Billed Store",
            cell: (s: any) => (
                <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-900">{s.storeId?.storeName || "Unknown Store"}</span>
                    <span className="text-[9px] text-slate-400 font-medium">{s.userId?.name || 'Unknown User'}</span>
                </div>
            )
        },
        {
            header: "Status",
            cell: (s: any) => (
                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${statusColors[s.status] || 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                    {s.status}
                </span>
            )
        },
        {
            header: "Expires",
            cell: (s: any) => {
                const isExpired = new Date(s.currentPeriodEnd) < new Date();
                return (
                    <span className={`text-xs font-bold ${isExpired ? 'text-rose-500' : 'text-slate-500'}`}>
                        {new Date(s.currentPeriodEnd).toLocaleDateString('en-GB')}
                    </span>
                );
            }
        },
        {
            header: "Modify",
            cell: (s: any) => (
                <div className="flex items-center gap-2">
                    {s.status === 'active'
                        ? <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-bold text-rose-600 border-rose-200 hover:bg-rose-50" onClick={() => handleStatusChange(s._id, s.status)}>Cancel</Button>
                        : <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-bold text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => handleStatusChange(s._id, s.status)}>Re-Activate</Button>
                    }
                    <button onClick={() => handleDelete(s._id)} className="w-8 h-8 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all border border-rose-100 hover:border-transparent" title="Expunge Record">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
            <header>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Billing & Subscriptions</h1>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">{totalItems} Active Subscription Records</p>
            </header>
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <AdminTable data={subscriptions} columns={columns} isLoading={loading} emptyMessage="No active subscription records found." />
                <AdminPagination currentPage={page} totalPages={totalPages} totalItems={totalItems} pageSize={PAGE_SIZE} onPageChange={setPage} />
            </div>
        </div>
    );
}
