"use client";

import { useCallback, useEffect, useState } from 'react';
import { AdminTable } from '@/components/admin/admin-table';
import { AdminPagination } from '@/components/admin/admin-pagination';

const PAGE_SIZE = 10;

export default function AdminContactMessagesPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const fetchMessages = useCallback(async (currentPage = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/contact-messages?page=${currentPage}&limit=${PAGE_SIZE}`);
            const data = await res.json();

            if (res.ok) {
                setMessages(data.messages || []);
                setTotalPages(data.pagination.pages || 1);
                setTotalItems(data.pagination.total || 0);
            } else {
                console.error('Failed to load contact messages:', data.error || data.message);
            }
        } catch (err) {
            console.error('Failed to load contact messages:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMessages(page);
    }, [fetchMessages, page]);

    const columns = [
        {
            header: 'Contact',
            cell: (item: any) => (
                <div className="space-y-1">
                    <p className="text-sm font-black text-slate-900">{item.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">{item.email}</p>
                    {item.phone ? <p className="text-xs text-slate-500">{item.phone}</p> : null}
                </div>
            )
        },
        {
            header: 'Subject',
            accessorKey: 'subject'
        },
        {
            header: 'Message',
            cell: (item: any) => (
                <div className="max-w-[24rem]">
                    <p className="text-sm text-slate-600 overflow-hidden text-ellipsis whitespace-nowrap">{item.message}</p>
                </div>
            )
        },
        {
            header: 'Status',
            cell: (item: any) => (
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] ${item.isRead ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-violet-50 text-violet-700 border border-violet-100'}`}>
                    {item.isRead ? 'Read' : (item.label || 'New')}
                </span>
            )
        },
        {
            header: 'Received',
            cell: (item: any) => new Date(item.createdAt).toLocaleString()
        }
    ];

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
            <header>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Contact Messages</h1>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">All submitted contact requests</p>
            </header>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <AdminTable data={messages} columns={columns} isLoading={loading} emptyMessage="No contact messages found." />
                <AdminPagination currentPage={page} totalPages={totalPages} totalItems={totalItems} pageSize={PAGE_SIZE} onPageChange={setPage} />
            </div>
        </div>
    );
}
