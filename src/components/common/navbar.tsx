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
        } catch (error: any) {
            if (error.name === 'AbortError') return;
            if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
                console.warn("Navbar: Network disconnected or server unreachable while fetching notifications.");
                return;
            }
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
        } catch (error: any) {
            if (error.name === 'AbortError') return;
            if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
                console.warn("Navbar: Network disconnected or server unreachable while fetching favorites.");
                return;
            }
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
                <div className={`max-w-6xl mx-auto glass-panel rounded-2xl md:rounded-2xl px-4 md:px-6 py-2.5 md:py-3 flex items-center justify-between shadow-2xl shadow-indigo-100/50 border border-violet-600/10 bg-white/80 backdrop-blur-md relative`}>
                    <Link href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
                        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-transform group-hover:rotate-6 active:scale-90">
                            <img src="/ethiopian-mascot.png" alt="KesewEj Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col -space-y-1 min-w-0">
                            <span className="text-base sm:text-lg md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-pink-600 tracking-tighter truncate">KesewEj</span>
                            <span className="text-[8px] md:text-[11px] font-bold text-violet-600 uppercase tracking-widest leading-none ml-0.5 italic">ከሰው እጅ</span>
                        </div>
                    </Link>

                    {/* Main Navigation (Desktop) */}
                    <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
                        <Link href="/" className={pathname === '/' ? "text-violet-600 underline decoration-2 underline-offset-4" : "hover:text-violet-600 transition-colors"}>Marketplace</Link>
                        <Link href="/about" className={pathname === '/about' ? "text-violet-600 underline decoration-2 underline-offset-4" : "hover:text-violet-600 transition-colors"}>About Us</Link>
                        <Link href="/pricing" className={pathname === '/pricing' ? "text-violet-600 underline decoration-2 underline-offset-4" : "hover:text-violet-600 transition-colors"}>Pricing</Link>
                    </div>

                    <div className="flex items-center gap-1.5 md:gap-4">
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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500 transition-colors"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                                        <span className="text-[9px] font-black text-slate-800 uppercase tracking-wider">Favorites</span>
                                        {unreadFavorites > 0 && (
                                            <div className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-black">
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
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-violet-600 transition-colors"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                                                <span className="text-[9px] font-black text-slate-800 uppercase tracking-wider">My Store</span>
                                            </button>
                                            
                                            <button
                                                onClick={() => router.push('/chat')}
                                                className="p-2 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-all group/nav relative flex flex-col items-center gap-1"
                                            >
                                                <MessageCircle className="w-5 h-5 text-sky-500 transition-colors" strokeWidth={2.5} />
                                                <span className="text-[9px] font-black text-slate-800 uppercase tracking-wider">Messages</span>
                                                {unreadTotal > 0 && (
                                                    <div className="absolute top-1 right-1 w-4 h-4 bg-sky-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-black animate-pulse">
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
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 transition-colors"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                                                <span className="text-[9px] font-black text-slate-800 uppercase tracking-wider">Alerts</span>
                                                {unreadNotifications > 0 && (
                                                    <div className="absolute top-1 right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-black animate-pulse">
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
                                            {/* Desktop: dropdown; Mobile: direct link to profile/settings */}
                                            <div className="hidden md:block">
                                                <ProfileDropdown />
                                            </div>
                                            <Link
                                                href="/profile"
                                                className="md:hidden w-11 h-11 bg-gradient-to-br from-violet-600 to-pink-600 text-white rounded-full flex items-center justify-center text-lg font-black transition-all hover:scale-105 active:scale-95 border-2 border-white shadow-lg shadow-violet-200"
                                                title="Profile & Settings"
                                            >
                                                {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                                            </Link>
                                        </div>
                                    ) : (
                                        <>
                                            <Link href="/auth/login" className="hidden sm:block text-[11px] font-black text-slate-600 hover:text-violet-600 uppercase tracking-widest active:scale-95 transition-all">Log In</Link>
                                            <Link href="/auth/register">
                                                <Button className="!h-9 md:!h-11 px-4 md:!px-8 rounded-xl font-black text-[9px] md:text-sm uppercase tracking-widest bg-gradient-to-r from-violet-600 to-pink-600 text-white border-none shadow-lg shadow-violet-100/50 transition-all hover:scale-105 active:scale-95">
                                                    Join
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                    
                                    {/* Mobile Menu Toggle */}
                                    <button 
                                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                        className="md:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-900 active:scale-95 transition-all shadow-sm"
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

                    {/* Mobile Menu Dropdown */}
                    {isMobileMenuOpen && (
                        <div className="absolute top-14 left-0 right-0 bg-white rounded-2xl border border-slate-100 shadow-xl md:hidden z-50 overflow-hidden mx-4 mt-2 mb-4">
                            <div className="flex flex-col p-2 space-y-1">
                                {session && (
                                    <div className="flex items-center gap-3 px-3 py-3 mb-2 border-b border-slate-50">
                                        <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-sm">
                                            {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-slate-900 font-semibold text-sm truncate">{session.user?.name}</span>
                                            <span className="text-slate-500 text-xs truncate">{session.user?.email}</span>
                                        </div>
                                    </div>
                                )}
                                {!session && (
                                    <div className="flex gap-2 px-2 pb-3 mb-2 border-b border-slate-50">
                                        <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center py-2 bg-slate-50 text-slate-700 text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-slate-100 transition-colors">
                                            Log In
                                        </Link>
                                        <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center py-2 bg-violet-600 text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-violet-700 transition-colors">
                                            Join
                                        </Link>
                                    </div>
                                )}

                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-2">Menu</p>

                                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${pathname === '/' ? 'bg-violet-50 text-violet-600' : 'text-slate-600 hover:bg-slate-50'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                                    <span className="font-semibold text-sm">Marketplace</span>
                                </Link>

                                <Link href="/brokers" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${pathname === '/brokers' ? 'bg-violet-50 text-violet-600' : 'text-slate-600 hover:bg-slate-50'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                    <span className="font-semibold text-sm">Get Brokers</span>
                                </Link>

                                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${pathname === '/about' ? 'bg-violet-50 text-violet-600' : 'text-slate-600 hover:bg-slate-50'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                                    <span className="font-semibold text-sm">About Us</span>
                                </Link>
                                
                                <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${pathname === '/pricing' ? 'bg-violet-50 text-violet-600' : 'text-slate-600 hover:bg-slate-50'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                                    <span className="font-semibold text-sm">Pricing</span>
                                </Link>

                                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${pathname === '/contact' ? 'bg-violet-50 text-violet-600' : 'text-slate-600 hover:bg-slate-50'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                    <span className="font-semibold text-sm">Contact Us</span>
                                </Link>

                                {!session && (
                                    <>
                                        <div className="pt-2 pb-1 px-3 mt-2 border-t border-slate-50">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">Restricted <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" strokeWidth="3"/></svg></p>
                                        </div>
                                        <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 opacity-70">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                                            <span className="font-semibold text-sm">Saved / Favorites</span>
                                        </div>
                                        <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 opacity-70">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                            <span className="font-semibold text-sm">Chat</span>
                                        </div>
                                        <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 opacity-70">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                                            <span className="font-semibold text-sm">Create Store</span>
                                        </div>
                                    </>
                                )}

                                {session && (
                                    <div className="pt-2 mt-2 border-t border-slate-50">
                                        <Link
                                            href={(session.user as any)?.storeId ? "/seller/mystore" : "/stores/create"}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                                            <span className="font-semibold text-sm">{(session.user as any)?.storeId ? "My Store" : "Create Store"}</span>
                                        </Link>
                                        <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                                            <span className="font-semibold text-sm">Settings</span>
                                        </Link>
                                    </div>
                                )}
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

            <BottomNav />
        </>
    );
};
