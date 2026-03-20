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
        color: "bg-amber-50 text-amber-600 border-amber-100"
    },
    {
        label: "Urgent",
        icon: <Zap className="w-4 h-4" />,
        href: "/products/urgent",
        color: "bg-red-50 text-red-600 border-red-100"
    },
    {
        label: "New Arrival",
        icon: <Clock className="w-4 h-4" />,
        href: "/products/new-arrivals",
        color: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
        label: "Get Brokers",
        icon: <Users className="w-4 h-4" />,
        href: "/brokers",
        color: "bg-purple-50 text-purple-600 border-purple-100"
    }
];

export function FeatureBar() {
    return (
        <div className="w-full bg-white border-b border-slate-100 py-1 px-1 md:px-2 overflow-x-auto no-scrollbar shadow-sm">
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
                    href="/products"
                    className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors ml-4 pr-1"
                >
                    View All Products
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
