"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

export default function StoresAdminPage() {
    const [stores, setStores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const fetchStores = useCallback(async (p = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/stores?page=${p}&limit=${PAGE_SIZE}`);
            const data = await res.json();
            if (res.ok) {
                setStores(data.stores);
                setTotalPages(data.pagination.pages);
                setTotalItems(data.pagination.total);
            }
        } catch (error) {
            console.error("Failed to fetch stores:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchStores(page); }, [fetchStores, page]);

    const handleStatusChange = async (storeId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'approved' ? 'rejected' : 'approved';
        if (!confirm(`Are you sure you want to ${newStatus.toUpperCase()} this store?`)) return;
        try {
            const res = await fetch(`/api/admin/stores/${storeId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) fetchStores(page);
            else alert("Failed to update store status");
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (storeId: string, name: string) => {
        if (!confirm(`DANGER: Permanently delete store "${name}"? This cannot be undone.`)) return;
        try {
            const res = await fetch(`/api/admin/stores/${storeId}`, { method: "DELETE" });
            if (res.ok) fetchStores(page);
            else alert("Failed to delete store");
        } catch (err) { console.error(err); }
    };

    const columns = [
        {
            header: "Store",
            cell: (s: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-100 to-indigo-50 flex items-center justify-center text-indigo-500 font-black text-base border border-indigo-100 overflow-hidden flex-shrink-0">
                        {s.logo?.url ? <img src={s.logo.url} alt={s.storeName} className="w-full h-full object-cover" /> : s.storeName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{s.storeName}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{s.storeType}</p>
                    </div>
                </div>
            )
        },
        {
            header: "Owner / Broker",
            cell: (s: any) => (
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-900">{s.ownerId?.name || s.sellerName || "Unknown"}</span>
                    <span className="text-[9px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded w-fit">
                        ID: {String(s.ownerId?._id || 'N/A').slice(-8)}
                    </span>
                </div>
            )
        },
        {
            header: "Status",
            cell: (s: any) => (
                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                    s.status === 'approved'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : 'bg-rose-50 text-rose-600 border-rose-100'
                }`}>{s.status}</span>
            )
        },
        {
            header: "Location",
            cell: (s: any) => <span className="text-xs text-slate-500 font-medium">{s.city ? `${s.city}` : '—'}</span>
        },
        {
            header: "Actions",
            cell: (s: any) => (
                <div className="flex items-center gap-2">
                    {s.status === 'approved'
                        ? <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-bold text-rose-600 border-rose-200 hover:bg-rose-50" onClick={() => handleStatusChange(s._id, s.status)}>Suspend</Button>
                        : <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-bold text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => handleStatusChange(s._id, s.status)}>Approve</Button>
                    }
                    <button onClick={() => handleDelete(s._id, s.storeName)} className="w-8 h-8 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all border border-rose-100 hover:border-transparent" title="Delete Store">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
            <header>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Store Management</h1>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">{totalItems} Registered Stores</p>
            </header>
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <AdminTable data={stores} columns={columns} isLoading={loading} emptyMessage="No stores found in the database." />
                <AdminPagination currentPage={page} totalPages={totalPages} totalItems={totalItems} pageSize={PAGE_SIZE} onPageChange={setPage} />
            </div>
        </div>
    );
}
