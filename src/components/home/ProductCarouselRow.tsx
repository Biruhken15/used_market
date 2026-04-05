"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/dashboard/product-card";

interface ProductCarouselRowProps {
    title: string;
    products: any[];
    filterUrl?: string;
}

export function ProductCarouselRow({ title, products, filterUrl }: ProductCarouselRowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === "left"
                ? scrollLeft - clientWidth
                : scrollLeft + clientWidth;

            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    if (!products || products.length === 0) return null;

    return (
        <div className="w-full py-0 px-4 md:px-10 bg-transparent overflow-hidden">
            <div className="w-full space-y-0">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl md:text-2xl font-black text-violet-600 tracking-tighter italic">
                        {title}
                    </h2>

                    <div className="flex items-center gap-2 scale-75 origin-right">
                        <button
                            onClick={() => scroll("left")}
                            className="p-2 border-2 border-slate-100 rounded-lg hover:border-violet-600 transition-colors shadow-sm"
                        >
                            <ChevronLeft className="w-5 h-5 text-slate-900" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="p-2 border-2 border-slate-100 rounded-lg hover:border-violet-600 transition-colors shadow-sm"
                        >
                            <ChevronRight className="w-5 h-5 text-slate-900" />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-3 md:gap-6 overflow-x-auto thin-scrollbar scroll-smooth pb-6 px-1 snap-x snap-mandatory"
                >
                    {Array.isArray(products) && products.map((product) => (
                        <div key={product._id} className="w-[140px] sm:w-[170px] md:w-[200px] lg:w-[220px] shrink-0 transition-all hover:scale-[1.02] snap-start">
                            <ProductCard product={product} />
                        </div>
                    ))}
                    {/* View More Card */}
                    {filterUrl && (
                        <div className="w-[140px] sm:w-[170px] md:w-[200px] lg:w-[220px] shrink-0 snap-start">
                            <Link href={filterUrl} className="h-full block">
                                <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl p-6 text-center group hover:border-slate-300 transition-all cursor-pointer bg-slate-50/30">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                        <ChevronRight className="w-6 h-6" />
                                    </div>
                                    <p className="font-extrabold text-slate-900 text-sm">View All</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">More {title}</p>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
