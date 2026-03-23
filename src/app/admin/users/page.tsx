"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

export default function UsersAdminPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const fetchUsers = useCallback(async (p = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/users?page=${p}&limit=${PAGE_SIZE}`);
            const data = await res.json();
            if (res.ok) {
                setUsers(data.users);
                setTotalPages(data.pagination.pages);
                setTotalItems(data.pagination.total);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchUsers(page); }, [fetchUsers, page]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        if (!confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) return;
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole })
            });
            if (res.ok) fetchUsers(page);
            else alert("Failed to update user role");
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (userId: string, name: string) => {
        if (!confirm(`DANGER: Permanently delete user "${name}"? This cannot be undone.`)) return;
        try {
            const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
            if (res.ok) fetchUsers(page);
            else alert("Failed to delete user");
        } catch (err) { console.error(err); }
    };

    const columns = [
        {
            header: "User",
            cell: (u: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-slate-100 flex items-center justify-center text-indigo-600 font-black text-sm border border-indigo-100 overflow-hidden flex-shrink-0">
                        {u.image ? <img src={u.image} alt={u.name} className="w-full h-full object-cover" /> : (u.name?.charAt(0) || '?').toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{u.name || "Unknown User"}</p>
                        <p className="text-[10px] text-slate-400 font-medium truncate">{u.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: "Role",
            cell: (u: any) => (
                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                    u.role === 'admin'
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-100'
                    : 'bg-slate-50 text-slate-500 border-slate-100'
                }`}>
                    {u.role || 'user'}
                </span>
            )
        },
        {
            header: "Store",
            cell: (u: any) => u.storeName
                ? <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">{u.storeName}</span>
                : <span className="text-xs text-slate-300 italic font-medium">No Store</span>
        },
        {
            header: "Joined",
            cell: (u: any) => <span className="text-xs text-slate-500 font-medium">{new Date(u.createdAt).toLocaleDateString('en-GB')}</span>
        },
        {
            header: "Actions",
            cell: (u: any) => (
                <div className="flex items-center gap-2">
                    {u.role === 'admin' ? (
                        <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-bold text-slate-500 border-slate-200 hover:bg-slate-50" onClick={() => handleRoleChange(u._id, 'user')}>
                            Revoke Admin
                        </Button>
                    ) : (
                        <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-bold text-indigo-600 border-indigo-200 hover:bg-indigo-50" onClick={() => handleRoleChange(u._id, 'admin')}>
                            Make Admin
                        </Button>
                    )}
                    <button onClick={() => handleDelete(u._id, u.name)} className="w-8 h-8 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all border border-rose-100 hover:border-transparent" title="Delete User">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">User Management</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">{totalItems} Platform Participants</p>
                </div>
            </header>
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <AdminTable data={users} columns={columns} isLoading={loading} emptyMessage="No users found in the database." />
                <AdminPagination currentPage={page} totalPages={totalPages} totalItems={totalItems} pageSize={PAGE_SIZE} onPageChange={handlePageChange} />
            </div>
        </div>
    );
}
