"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    if (totalPages <= 1) return null;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    const goToPage = (pageNumber: number) => {
        router.push(createPageURL(pageNumber));
    };

    // Logical windowing for pagination numbers
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, start + maxVisible - 1);
        
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-center gap-2 py-12">
            <Button
                variant="outline"
                disabled={currentPage <= 1}
                onClick={() => goToPage(currentPage - 1)}
                className="w-10 h-10 p-0 rounded-xl hover:bg-slate-100 border-slate-200"
            >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
            </Button>

            <div className="flex items-center gap-1.5 mx-2">
                {pageNumbers[0] > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            className="w-10 h-10 rounded-xl font-bold text-slate-400"
                            onClick={() => goToPage(1)}
                        >
                            1
                        </Button>
                        {pageNumbers[0] > 2 && <span className="text-slate-300 px-1">...</span>}
                    </>
                )}

                {pageNumbers.map((page) => {
                    const isCurrent = page === currentPage;
                    return (
                        <Button
                            key={page}
                            variant={isCurrent ? "primary" : "ghost"}
                            className={`w-10 h-10 rounded-xl font-bold transition-all ${
                                isCurrent 
                                ? 'bg-slate-950 text-white shadow-xl scale-110' 
                                : 'text-slate-500 hover:bg-slate-100'
                            }`}
                            onClick={() => goToPage(page)}
                        >
                            {page}
                        </Button>
                    );
                })}

                {pageNumbers[pageNumbers.length - 1] < totalPages && (
                    <>
                        {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="text-slate-300 px-1">...</span>}
                        <Button
                            variant="ghost"
                            className="w-10 h-10 rounded-xl font-bold text-slate-400"
                            onClick={() => goToPage(totalPages)}
                        >
                            {totalPages}
                        </Button>
                    </>
                )}
            </div>

            <Button
                variant="outline"
                disabled={currentPage >= totalPages}
                onClick={() => goToPage(currentPage + 1)}
                className="w-10 h-10 p-0 rounded-xl hover:bg-slate-100 border-slate-200"
            >
                <ChevronRight className="w-5 h-5 text-slate-600" />
            </Button>
        </div>
    );
}
