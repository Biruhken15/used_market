"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

export default function ProductsAdminPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const fetchProducts = useCallback(async (p = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/products?page=${p}&limit=${PAGE_SIZE}`);
            const data = await res.json();
            if (res.ok) {
                setProducts(data.products);
                setTotalPages(data.pagination.pages);
                setTotalItems(data.pagination.total);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchProducts(page); }, [fetchProducts, page]);

    const handleStatusChange = async (productId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'archived' : 'active';
        if (!confirm(`Forcibly mark this product as ${newStatus.toUpperCase()}?`)) return;
        try {
            const res = await fetch(`/api/admin/products/${productId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) fetchProducts(page);
            else alert("Failed to moderate product");
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (productId: string, title: string) => {
        if (!confirm(`DANGER: Permanently delete "${title}"? This cannot be undone.`)) return;
        try {
            const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
            if (res.ok) fetchProducts(page);
            else alert("Failed to delete product");
        } catch (err) { console.error(err); }
    };

    const statusColors: Record<string, string> = {
        active: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        sold: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        archived: 'bg-rose-50 text-rose-600 border-rose-100',
        pending: 'bg-amber-50 text-amber-600 border-amber-100',
    };

    const columns = [
        {
            header: "Product",
            cell: (p: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                        {p.thumbnail
                            ? <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-slate-300 text-xl">📸</div>}
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate max-w-[180px]">{p.title}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{p.price?.toLocaleString()} ETB</p>
                    </div>
                </div>
            )
        },
        {
            header: "Store / Seller",
            cell: (p: any) => (
                <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-800">{p.storeId?.storeName || '—'}</span>
                    <span className="text-[9px] text-slate-400 font-medium">{p.ownerId?.name || 'Unknown Seller'}</span>
                </div>
            )
        },
        {
            header: "Status",
            cell: (p: any) => (
                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${statusColors[p.status] || 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                    {p.status}
                </span>
            )
        },
        {
            header: "Category",
            cell: (p: any) => <span className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">{p.category}</span>
        },
        {
            header: "Moderate",
            cell: (p: any) => (
                <div className="flex items-center gap-2">
                    {p.status === 'active'
                        ? <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-bold text-slate-600 border-slate-200 hover:bg-slate-50" onClick={() => handleStatusChange(p._id, p.status)}>Archive</Button>
                        : <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-bold text-indigo-600 border-indigo-200 hover:bg-indigo-50" onClick={() => handleStatusChange(p._id, p.status)}>Activate</Button>
                    }
                    <button onClick={() => handleDelete(p._id, p.title)} className="w-8 h-8 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all border border-rose-100 hover:border-transparent" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
            <header>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Content Moderation</h1>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">{totalItems} Platform Listings</p>
            </header>
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <AdminTable data={products} columns={columns} isLoading={loading} emptyMessage="No products published platform-wide." />
                <AdminPagination currentPage={page} totalPages={totalPages} totalItems={totalItems} pageSize={PAGE_SIZE} onPageChange={setPage} />
            </div>
        </div>
    );
}
