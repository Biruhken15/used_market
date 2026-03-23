"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

const PAGE_TITLES: Record<string, string> = {
    "/admin": "Dashboard",
    "/admin/users": "User Management",
    "/admin/stores": "Store Management",
    "/admin/products": "Content Moderation",
    "/admin/subscriptions": "Billing & Subscriptions",
};

export function AdminNavbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const pageTitle = PAGE_TITLES[pathname] || "Admin Panel";

    return (
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-10 sticky top-0 z-40 shadow-sm">
            {/* Left: Logo (Logo Only) */}
            <Link href="/admin" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-base shadow-md shadow-indigo-200 group-hover:bg-indigo-700 transition-colors">
                    UM
                </div>
                <div className="hidden sm:flex flex-col">
                    <span className="text-slate-900 font-black text-sm leading-none tracking-tight">Used Market</span>
                    <span className="text-[8px] font-black uppercase text-indigo-400 tracking-[0.2em] mt-0.5">Admin Panel</span>
                </div>
            </Link>

            {/* Center: Current Page Title */}
            <div className="absolute left-1/2 -translate-x-1/2">
                <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest hidden md:block">{pageTitle}</h2>
            </div>

            {/* Right: Admin User Dropdown */}
            <div className="relative">
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 pl-3 pr-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200"
                >
                    <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs">
                        {(session?.user?.name || "A").charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:flex flex-col items-start">
                        <span className="text-xs font-bold text-slate-800 leading-none">{session?.user?.name || "Admin"}</span>
                        <span className="text-[9px] text-slate-400 font-medium mt-0.5 uppercase tracking-widest">Administrator</span>
                    </div>
                    <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>

                {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-slate-50">
                            <p className="text-xs font-bold text-slate-900 truncate">{session?.user?.email}</p>
                            <p className="text-[9px] font-black uppercase text-indigo-500 tracking-widest mt-0.5">Admin</p>
                        </div>
                        <div className="p-2">
                            <Link href="/" className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                View Live Site
                            </Link>
                            <button
                                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
