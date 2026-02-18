"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";

import { ProfileDropdown } from "../auth/profile-dropdown";

export const Navbar = () => {
    const { data: session, status } = useSession();

    return (
        <nav className="fixed top-0 w-full z-50 px-4 pt-6">
            <div className={`max-w-7xl mx-auto glass-light rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm border border-slate-100 ${session ? 'bg-white' : ''}`}>
                <Link href="/" className="text-2xl font-bold text-slate-900 tracking-tighter flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-105 shadow-lg shadow-blue-100">
                        E
                    </div>
                    <span className="hidden sm:inline font-black">Used Market</span>
                </Link>

                {/* Main Navigation - Distinct for Guest vs User */}
                <div className="flex items-center gap-10 text-sm font-bold text-slate-600">
                    {!session ? (
                        <>
                            <Link href="/" className="hover:text-blue-600 transition-colors uppercase tracking-widest text-[11px]">Explore Market</Link>
                            <Link href="/pricing" className="hover:text-blue-600 transition-colors uppercase tracking-widest text-[11px]">Pricing Plans</Link>
                            <Link href="/" className="hover:text-blue-600 transition-colors uppercase tracking-widest text-[11px]">Our Story</Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-1 text-slate-400">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-slate-50 rounded-lg">Working Dashboard</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {status === "loading" ? (
                        <div className="w-11 h-11 bg-slate-100 rounded-full animate-pulse"></div>
                    ) : session ? (
                        <div className="flex items-center gap-3">
                            {/* Action Icons with Labels */}
                            <div className="flex items-center gap-1 mr-4 border-r border-slate-100 pr-4">
                                <Link href="/favorites" className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-red-500 transition-all group/nav">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/nav:scale-110 transition-transform"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 group-hover/nav:text-slate-600">Favorites</span>
                                </Link>
                                <Link href="/dashboard" className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-all group/nav">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/nav:scale-110 transition-transform"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 group-hover/nav:text-slate-600">My Store</span>
                                </Link>
                                <button className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-all group/nav relative">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/nav:scale-110 transition-transform"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 group-hover/nav:text-slate-600">Alerts</span>
                                    <span className="absolute top-2 right-4 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
                                </button>
                            </div>
                            <ProfileDropdown />
                        </div>
                    ) : (
                        <div className="flex items-center gap-6 font-black">
                            <Link href="/auth/login" className="hidden sm:block text-slate-400 hover:text-blue-600 transition-colors tracking-tight">Log In</Link>
                            <Link href="/auth/register">
                                <Button className="!py-3 !px-8 rounded-xl font-black shadow-blue-100 shadow-2xl transition-all hover:scale-105 active:scale-95 bg-blue-600 text-white border-none">Start Trading</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
