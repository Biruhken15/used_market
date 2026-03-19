"use client";

import { useRef } from "react";
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
        <div className="w-full py-8 px-4 md:px-8 bg-transparent overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight italic">
                        {title}
                    </h2>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => scroll("left")}
                            className="p-2 border-2 border-slate-100 rounded-lg hover:border-slate-950 transition-colors shadow-sm"
                        >
                            <ChevronLeft className="w-5 h-5 text-slate-900" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="p-2 border-2 border-slate-100 rounded-lg hover:border-slate-950 transition-colors shadow-sm"
                        >
                            <ChevronRight className="w-5 h-5 text-slate-900" />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4 px-1"
                >
                    {products.map((product) => (
                        <div key={product._id} className="min-w-[200px] w-1/6 shrink-0 transition-all hover:scale-[1.02]">
                            <ProductCard product={product} />
                        </div>
                    ))}
                    {/* View More Card */}
                    {filterUrl && (
                        <div className="min-w-[200px] w-1/6 shrink-0">
                            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl p-6 text-center group hover:border-slate-300 transition-all cursor-pointer bg-slate-50/30">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                    <ChevronRight className="w-6 h-6" />
                                </div>
                                <p className="font-bold text-slate-900 text-sm">View All</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">More {title}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
