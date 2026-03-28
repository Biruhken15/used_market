"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ProfileDropdown } from "../auth/profile-dropdown";
import { usePathname, useRouter } from "next/navigation";
import { NotificationSidebar } from "../seller/NotificationSidebar";
import { BottomNav } from "./BottomNav";
import { MessageCircle } from "lucide-react";
import { useChatContext } from "@/components/chat/ChatManager";

export const Navbar = () => {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [unreadFavorites, setUnreadFavorites] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { unreadTotal, openChat } = useChatContext();
    const router = useRouter();

    const fetchNotifications = async () => {
        if (!session) return;
        try {
            const res = await fetch("/api/notifications");
            const data = await res.json();
            if (res.ok) {
                setNotifications(data.notifications);
                setUnreadNotifications(data.unreadCount);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const res = await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ markAll: true })
            });
            if (res.ok) {
                setUnreadNotifications(0);
            }
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const fetchUnreadCount = async () => {
        if (!session) return;
        try {
            const res = await fetch("/api/favorites");
            const data = await res.json();
            if (res.ok) {
                setUnreadFavorites(data.unreadCount || 0);
            }
        } catch (error) {
            console.error("Error fetching unread count:", error);
        }
    };

    useEffect(() => {
        if (session) {
            fetchUnreadCount();
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }

        window.addEventListener('favoritesUpdated', fetchUnreadCount);
        window.addEventListener('notificationsUpdated', fetchNotifications);
        return () => {
            window.removeEventListener('favoritesUpdated', fetchUnreadCount);
            window.removeEventListener('notificationsUpdated', fetchNotifications);
        };
    }, [session]);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (status === 'authenticated' && (session?.user as any)?.role === 'admin') {
            router.push('/admin');
        }
    }, [session, status, router]);

    if (status === 'authenticated' && (session?.user as any)?.role === 'admin') {
        return null;
    }

    return (
        <>
            <nav className="fixed top-0 w-full z-50 px-3 md:px-4 pt-4 md:pt-6">
                <div className={`max-w-6xl mx-auto glass-panel rounded-2xl md:rounded-2xl px-4 md:px-6 py-2.5 md:py-3 flex items-center justify-between shadow-2xl shadow-indigo-100/50 border border-indigo-600/10 bg-white/80 backdrop-blur-md relative`}>
                    <Link href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
                        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-transform group-hover:rotate-6 active:scale-90">
                            <img src="/ethiopian-mascot.png" alt="Used Market Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col -space-y-1">
                            <span className="text-lg md:text-2xl font-black text-slate-900 tracking-tighter">Used Market</span>
                            <span className="text-[9px] md:text-[11px] font-bold text-indigo-600 uppercase tracking-widest leading-none ml-0.5 italic">ከሰው እጅ</span>
                        </div>
                    </Link>

                    {/* Main Navigation (Desktop) */}
                    <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
                        <Link href="/" className={pathname === '/' ? "text-indigo-600 underline decoration-2 underline-offset-4" : "hover:text-indigo-600 transition-colors"}>Marketplace</Link>
                        <Link href="/brokers" className={pathname === '/brokers' ? "text-indigo-600 underline decoration-2 underline-offset-4" : "hover:text-indigo-600 transition-colors"}>Brokers</Link>
                        <Link href="/pricing" className={pathname === '/pricing' ? "text-indigo-600 underline decoration-2 underline-offset-4" : "hover:text-indigo-600 transition-colors"}>Pricing</Link>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        {status === "loading" ? (
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-100 rounded-full animate-pulse"></div>
                        ) : (
                            <div className="flex items-center gap-2 md:gap-6">
                                {/* Desktop Action Icons */}
                                <div className="hidden md:flex items-center gap-2 mr-2 border-r border-slate-100 pr-4">
                                    <button
                                        onClick={() => {
                                            if (!session) {
                                                alert("Please register first to view favorites.");
                                                router.push('/auth/register');
                                            } else {
                                                router.push('/favorites');
                                            }
                                        }}
                                        className="p-2 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-all group/nav relative flex flex-col items-center gap-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover/nav:text-indigo-500 transition-colors"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider group-hover/nav:text-slate-600">Favorites</span>
                                        {unreadFavorites > 0 && (
                                            <div className="absolute top-1 right-1 w-4 h-4 bg-indigo-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-black">
                                                {unreadFavorites}
                                            </div>
                                        )}
                                    </button>
                                    
                                    {session && (
                                        <>
                                            <button
                                                onClick={() => router.push('/seller/mystore')}
                                                className="p-2 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-all group/nav flex flex-col items-center gap-1"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover/nav:text-indigo-600 transition-colors"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider group-hover/nav:text-slate-600">My Store</span>
                                            </button>
                                            
                                            <button
                                                onClick={() => router.push('/chat')}
                                                className="p-2 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-all group/nav relative flex flex-col items-center gap-1"
                                            >
                                                <MessageCircle className="w-5 h-5 text-slate-400 group-hover/nav:text-indigo-600 transition-colors" strokeWidth={2.5} />
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider group-hover/nav:text-slate-600">Messages</span>
                                                {unreadTotal > 0 && (
                                                    <div className="absolute top-1 right-1 w-4 h-4 bg-violet-600 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-black animate-pulse">
                                                        {unreadTotal}
                                                    </div>
                                                )}
                                            </button>

                                            <button
                                                onClick={() => {
                                                    markAllAsRead();
                                                    setIsSidebarOpen(true);
                                                }}
                                                className="p-2 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-all group/nav relative flex flex-col items-center gap-1"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover/nav:text-indigo-600 transition-colors"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider group-hover/nav:text-slate-600">Alerts</span>
                                                {unreadNotifications > 0 && (
                                                    <div className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-black animate-pulse">
                                                        {unreadNotifications}
                                                    </div>
                                                )}
                                            </button>
                                        </>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    {session ? (
                                        <div className="flex items-center gap-2">
                                            <ProfileDropdown />
                                        </div>
                                    ) : (
                                        <>
                                            <Link href="/auth/login" className="hidden sm:block text-[11px] font-black text-slate-600 hover:text-indigo-600 uppercase tracking-widest active:scale-95 transition-all">Log In</Link>
                                            <Link href="/auth/register">
                                                <Button className="!h-9 md:!h-11 px-4 md:!px-8 rounded-xl font-black text-[9px] md:text-sm uppercase tracking-widest bg-gradient-to-r from-violet-600 to-pink-600 text-white border-none shadow-lg shadow-indigo-100/50 transition-all hover:scale-105 active:scale-95">
                                                    Join
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                    
                                    {/* Mobile Menu Toggle */}
                                    <button 
                                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                        className="md:hidden p-2 rounded-xl bg-slate-50 text-slate-900 active:scale-95 transition-all"
                                    >
                                        {isMobileMenuOpen ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Drawer Overlay */}
                    {isMobileMenuOpen && (
                        <div className="fixed inset-0 z-[60] md:hidden">
                            {/* Backdrop */}
                            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                            
                            {/* Drawer */}
                            <div className="absolute top-0 right-0 h-full w-[280px] bg-white shadow-2xl animate-drawer-in p-8 flex flex-col">
                                <div className="flex items-center justify-between mb-12">
                                    <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Navigation</span>
                                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full bg-slate-50">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                    </button>
                                </div>

                                <div className="flex flex-col gap-8 text-sm font-black uppercase tracking-widest">
                                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-4 ${pathname === '/' ? 'text-indigo-600' : 'text-slate-900'}`}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${pathname === '/' ? 'bg-indigo-50' : 'bg-slate-50'}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                                        </div>
                                        Marketplace
                                    </Link>
                                    <Link href="/brokers" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-4 ${pathname === '/brokers' ? 'text-indigo-600' : 'text-slate-900'}`}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${pathname === '/brokers' ? 'bg-indigo-50' : 'bg-slate-50'}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>
                                        </div>
                                        Find Brokers
                                    </Link>
                                    <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-4 ${pathname === '/pricing' ? 'text-indigo-600' : 'text-slate-900'}`}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${pathname === '/pricing' ? 'bg-indigo-50' : 'bg-slate-50'}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                                        </div>
                                        Subscription
                                    </Link>
                                </div>

                                <div className="mt-auto space-y-4">
                                    {!session ? (
                                        <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button className="w-full !h-12 rounded-xl font-black text-xs uppercase tracking-widest bg-slate-950 text-white">
                                                Log In
                                            </Button>
                                        </Link>
                                    ) : (
                                        <div className="p-4 rounded-2xl bg-slate-50 space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signed in as</p>
                                            <p className="text-[11px] font-black text-slate-900 truncate">{(session?.user as any)?.email}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <NotificationSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    notifications={notifications}
                    onMarkAllAsRead={markAllAsRead}
                />
            </nav>

            <BottomNav 
                unreadNotifications={unreadNotifications} 
                unreadFavorites={unreadFavorites} 
            />
        </>
    );
};
