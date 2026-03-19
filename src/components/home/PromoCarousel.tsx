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

const mockPromos: PromoItem[] = [
    {
        id: "1",
        title: "Premium Tech Marketplace",
        description: "Verified electronics from top-tier sellers in Addis.",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200",
        tag: "PROMOTED",
        href: "/products?category=electronics",
        color: "from-blue-600/10 to-indigo-600/20"
    },
    {
        id: "2",
        title: "Exclusive Real Estate",
        description: "Discover luxury properties with verified broker mediation.",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200",
        tag: "PREMIUM",
        href: "/products?category=real-estate",
        color: "from-amber-600/10 to-orange-600/20"
    },
    {
        id: "3",
        title: "Urgent Hot Deals ⚡",
        description: "Quick sales on premium items. Verified and secured.",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200",
        tag: "URGENT",
        href: "/products?filter=urgent",
        color: "from-red-600/10 to-rose-600/20"
    }
];

export function PromoCarousel() {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent((prev) => (prev + 1) % mockPromos.length);
    const prev = () => setCurrent((prev) => (prev - 1 + mockPromos.length) % mockPromos.length);

    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-full min-h-[350px] bg-slate-100 overflow-hidden group">
            {mockPromos.map((item, index) => (
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

                    <div className="absolute inset-0 z-20 flex items-center px-8 md:px-20 lg:px-32">
                        <div className="max-w-xl space-y-6">
                            <span className="inline-block px-3 py-1 bg-white text-slate-950 text-[10px] font-black uppercase tracking-[0.3em] rounded-md shadow-sm">
                                {item.tag}
                            </span>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-950 leading-tight tracking-tighter italic">
                                {item.title}
                            </h2>
                            <p className="text-slate-700 text-sm md:text-base font-bold max-w-md">
                                {item.description}
                            </p>
                            <div className="pt-2">
                                <Link href={item.href}>
                                    <Button className="h-12 px-6 bg-slate-950 text-white rounded-xl font-black text-sm hover:scale-105 transition-transform shadow-xl shadow-slate-950/20">
                                        Explore Now
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

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
                {mockPromos.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-3 h-3 rounded-full transition-all ${i === current ? "bg-slate-950 w-8" : "bg-slate-950/20"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
