"use client";

import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui/button";

export const ProfileDropdown = () => {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [store, setStore] = useState<any>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const checkStore = async () => {
            if (!session) {
                setStore(null);
                return;
            }
            try {
                const res = await fetch("/api/stores");
                const data = await res.json();
                setStore(data.store || null);
            } catch (err) {
                console.error("Error checking store:", err);
                setStore(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        checkStore();

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [session]);

    if (!session?.user) return null;

    const initial = session.user.name ? session.user.name[0].toUpperCase() : "U";

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-11 h-11 bg-slate-900 text-white rounded-full flex items-center justify-center text-lg font-black transition-all hover:scale-105 active:scale-95 border-2 border-white shadow-md shadow-slate-200"
            >
                {initial}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 py-3 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-5 py-3 border-b border-slate-50 mb-2">
                        <p className="font-black text-slate-800 text-base truncate">{session.user.name}</p>
                        <p className="text-slate-400 font-bold text-[11px] truncate">{session.user.email}</p>
                    </div>

                    <div className="px-1.5 space-y-0.5">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                            onClick={() => setIsOpen(false)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-blue-600"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
                            <span className="font-bold text-sm text-slate-600 group-hover:text-slate-900">Dashboard</span>
                        </Link>

                        <Link
                            href={store ? `/store/${store.storeSlug}` : "/stores/create"}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                            onClick={() => setIsOpen(false)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-blue-600"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm text-slate-600 group-hover:text-slate-900">{store ? "My Store" : "Create Store"}</span>
                                {!store && <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest leading-none">Become a Seller</span>}
                            </div>
                        </Link>

                        <button
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-blue-600"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                            <span className="font-bold text-sm text-slate-600 group-hover:text-slate-900">Favorites</span>
                        </button>

                        <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                            onClick={() => setIsOpen(false)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-blue-600"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                            <span className="font-bold text-sm text-slate-600 group-hover:text-slate-900">Settings</span>
                        </Link>
                    </div>

                    <div className="px-4 pt-3 mt-2 border-t border-slate-50">
                        <button
                            onClick={() => signOut()}
                            className="w-full flex items-center gap-3 px-2 py-2 text-red-500 hover:text-red-600 transition-colors font-bold text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
