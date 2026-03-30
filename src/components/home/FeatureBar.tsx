"use client";

import Link from "next/link";
import {
    Zap,
    Star,
    Clock,
    Users,
    Store,
    ChevronRight
} from "lucide-react";

const features = [
    {
        label: "All Products",
        icon: <Store className="w-4 h-4" />,
        href: "/products",
        color: "bg-slate-50 text-slate-600 border-slate-100"
    },
    {
        label: "Featured",
        icon: <Star className="w-4 h-4" />,
        href: "/products/featured",
        color: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100"
    },
    {
        label: "Urgent",
        icon: <Zap className="w-4 h-4" />,
        href: "/products/urgent",
        color: "bg-rose-50 text-rose-600 border-rose-100"
    },
    {
        label: "New Arrival",
        icon: <Clock className="w-4 h-4" />,
        href: "/products/new-arrivals",
        color: "bg-pink-50 text-pink-600 border-pink-100"
    },
    {
        label: "Get Brokers",
        icon: <Users className="w-4 h-4" />,
        href: "/brokers",
        color: "bg-violet-50 text-violet-600 border-violet-100"
    }
];

export function FeatureBar() {
    return (
        <div className="w-full bg-white border-b border-slate-100 py-1 px-1 md:px-2 overflow-x-auto thin-scrollbar shadow-sm sticky top-[72px] md:top-[88px] z-40">
            <div className="max-w-full flex items-center justify-start gap-2.5 min-w-max">
                {features.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${item.color} font-black text-[11px] uppercase tracking-wider hover:shadow-sm transition-all active:scale-95 whitespace-nowrap shadow-sm`}
                    >
                        <span className="opacity-70 scale-90">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}

                <Link
                    href="/stores/create"
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 text-slate-900 border border-slate-200 font-black text-[11px] uppercase tracking-wider hover:bg-white hover:border-slate-900 transition-all active:scale-95 whitespace-nowrap shadow-sm ml-auto"
                >
                    Create Store Freely
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                </Link>
            </div>
        </div>
    );
}
