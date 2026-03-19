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
    },
    {
        label: "Create Store",
        icon: <Store className="w-4 h-4" />,
        href: "/stores/create",
        color: "bg-emerald-50 text-emerald-600 border-emerald-100"
    }
];

export function FeatureBar() {
    return (
        <div className="w-full bg-white border-b border-slate-100 py-4 px-4 md:px-8 overflow-x-auto no-scrollbar">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 min-w-max">
                <div className="flex items-center gap-3">
                    {features.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border ${item.color} font-bold text-sm hover:shadow-md transition-all active:scale-95`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </div>

                <Link
                    href="/products"
                    className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors ml-4"
                >
                    View All Products
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
