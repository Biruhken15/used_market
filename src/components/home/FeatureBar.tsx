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
        color: "bg-emerald-50 text-emerald-600 border-emerald-100"
    },
    {
        label: "Get Brokers",
        icon: <Users className="w-4 h-4" />,
        href: "/brokers",
        color: "bg-violet-50 text-violet-600 border-violet-100"
    }
];

import { useSession } from "next-auth/react";

export function FeatureBar() {
    const { data: session } = useSession();
    const storeId = (session?.user as any)?.storeId;

    return (
        <div className="w-full bg-white border-b border-slate-100 py-1 px-1 md:px-2 overflow-x-auto thin-scrollbar shadow-sm sticky top-[72px] md:top-[88px] z-40">
            <div className="max-w-full flex items-center justify-between gap-3 md:gap-6 flex-wrap">
                <div className="flex items-center gap-2.5 min-w-max overflow-x-auto no-scrollbar">
                    {features.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${item.color} font-black text-[11px] uppercase tracking-wider hover:shadow-sm transition-all active:scale-95 whitespace-nowrap shadow-sm`}
                        >
                            <span className="opacity-100">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </div>

                <Link
                    href={storeId ? "/seller/mystore" : "/stores/create"}
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 text-white border border-transparent font-black text-[11px] uppercase tracking-wider hover:shadow-2xl hover:shadow-violet-300/40 transition-all active:scale-95 whitespace-nowrap ml-auto mr-2 md:mr-4"
                >
                    {storeId ? "My Store Dashboard" : "Create Store Freely"}
                    <ChevronRight className="w-3 h-3 text-white" />
                </Link>
            </div>
        </div>
    );
}
