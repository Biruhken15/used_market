"use client";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}

export function AdminPagination({ currentPage, totalPages, totalItems, pageSize, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);

    const getPages = () => {
        const pages: (number | '...')[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-50">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Showing <span className="text-slate-700">{start}–{end}</span> of <span className="text-slate-700">{totalItems}</span> records
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                {getPages().map((p, i) =>
                    p === '...'
                        ? <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-slate-300 text-xs font-bold">…</span>
                        : <button
                            key={p}
                            onClick={() => onPageChange(p as number)}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                                currentPage === p
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            {p}
                          </button>
                )}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
            </div>
        </div>
    );
}
