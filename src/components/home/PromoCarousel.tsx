"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PromoItem {
    id: string;
    title: string;
    description: string;
    image: string;
    tag: string;
    href: string;
    color: string;
}

export function PromoCarousel({ initialProducts = [] }: { initialProducts?: any[] }) {
    const [current, setCurrent] = useState(0);

    // Map real products to the promo format
    const promos: PromoItem[] = initialProducts.length > 0 
        ? initialProducts.map((p, i) => ({
            id: p._id,
            title: p.title,
            description: p.description.length > 120 ? p.description.substring(0, 120) + '...' : p.description,
            image: p.images?.[0]?.url || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200",
            tag: p.isUrgent ? "URGENT DEAL" : p.isFeatured ? "FEATURED" : "PROMOTED",
            href: `/products/${p._id}`,
            color: i % 3 === 0 ? "from-violet-600/20 to-indigo-600/10" : 
                   i % 3 === 1 ? "from-fuchsia-600/20 to-pink-600/10" : 
                   "from-rose-600/20 to-orange-600/10"
        }))
        : [
            {
                id: "default-1",
                title: "Premium Marketplace Ethiopia",
                description: "The professional standard for quality used products. Join +500 successful merchants today.",
                image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200",
                tag: "JOIN US",
                href: "/stores/create",
                color: "from-violet-600/20 to-pink-600/10"
            }
        ];

    const next = () => setCurrent((prev) => (prev + 1) % promos.length);
    const prev = () => setCurrent((prev) => (prev - 1 + promos.length) % promos.length);

    useEffect(() => {
        if (promos.length <= 1) return;
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [promos.length]);

    return (
        <div className="relative w-full h-full min-h-[350px] bg-slate-100 overflow-hidden group">
            {promos.map((item, index) => (
                <div
                    key={item.id}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${index === current ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
                        }`}
                >
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.color} z-10`}></div>
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 z-20 flex items-center px-8 md:px-20 lg:px-24">
                        <div className="max-w-xl space-y-4 md:space-y-6">
                            <span className="inline-block px-3 py-1 bg-white text-slate-950 text-[10px] font-black uppercase tracking-[0.3em] rounded-md shadow-sm">
                                {item.tag}
                            </span>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-950 leading-tight tracking-tighter italic lg:pr-10">
                                {item.title}
                            </h2>
                            <p className="text-slate-700 text-sm md:text-base font-bold max-w-md line-clamp-2 md:line-clamp-none">
                                {item.description}
                            </p>
                            <div className="pt-2">
                                <Link href={item.href}>
                                    <Button className="h-12 px-8 bg-slate-950 text-white rounded-xl font-black text-sm hover:scale-105 transition-transform shadow-xl shadow-slate-950/20">
                                        Explore Now
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {promos.length > 1 && (
                <>
                {/* Controls */}
                <button
                    onClick={prev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                    <ChevronLeft className="w-6 h-6 text-slate-900" />
                </button>
                <button
                    onClick={next}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                    <ChevronRight className="w-6 h-6 text-slate-900" />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                    {promos.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`w-3 h-3 rounded-full transition-all ${i === current ? "bg-slate-950 w-8" : "bg-slate-950/20"
                                }`}
                        />
                    ))}
                </div>
                </>
            )}
        </div>
    );
}

