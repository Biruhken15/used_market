"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiUsers, FiShoppingBag, FiBox, FiActivity, FiHome, FiMessageSquare } from "react-icons/fi";

export function AdminSidebar() {
    const pathname = usePathname();

    const links = [
        { name: "Dashboard", href: "/admin", icon: FiHome },
        { name: "Users", href: "/admin/users", icon: FiUsers },
        { name: "Stores", href: "/admin/stores", icon: FiShoppingBag },
        { name: "Products", href: "/admin/products", icon: FiBox },
        { name: "Contact Messages", href: "/admin/contact-messages", icon: FiMessageSquare },
        { name: "Subscriptions", href: "/admin/subscriptions", icon: FiActivity },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden lg:flex">
            <div className="p-8 border-b border-slate-800/50">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                        UM
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-black tracking-tight leading-none text-lg">Used Market</span>
                        <span className="text-[9px] font-black uppercase text-indigo-400 tracking-[0.2em] mt-1">Admin Panel</span>
                    </div>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-8 space-y-2">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${
                                isActive 
                                ? "bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/20" 
                                : "text-slate-400 font-medium hover:bg-slate-800/50 hover:text-slate-200"
                            }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                            <span className="text-sm">{link.name}</span>
                        </Link>
                    );
                })}
            </div>

            <div className="p-6 border-t border-slate-800/50">
                <Link href="/" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-colors">
                    Back to Main Site
                </Link>
            </div>
        </aside>
    );
}
