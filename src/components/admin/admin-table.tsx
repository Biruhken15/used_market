"use client";

import React, { ReactNode } from "react";

interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => ReactNode;
}

interface AdminTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (item: T) => void;
    emptyMessage?: string;
    isLoading?: boolean;
}

export function AdminTable<T>({ 
    data, 
    columns, 
    onRowClick, 
    emptyMessage = "No records found.",
    isLoading = false 
}: AdminTableProps<T>) {

    if (isLoading) {
        return (
            <div className="w-full h-64 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm animate-pulse">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Data...</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center text-slate-400 font-bold text-sm bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-80 mix-blend-multiply">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="w-full bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            {columns.map((col, i) => (
                                <th key={i} className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {data.map((item, i) => (
                            <tr 
                                key={i} 
                                onClick={() => onRowClick && onRowClick(item)}
                                className={`group hover:bg-slate-50/80 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                            >
                                {columns.map((col, j) => (
                                    <td key={j} className="p-5 text-sm font-medium text-slate-700">
                                        {col.cell ? col.cell(item) : col.accessorKey ? String(item[col.accessorKey]) : null}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
