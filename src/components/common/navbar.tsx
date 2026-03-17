"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ProfileDropdown } from "../auth/profile-dropdown";
import { usePathname, useRouter } from "next/navigation";
import { NotificationSidebar } from "../seller/NotificationSidebar";

export const Navbar = () => {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [unreadFavorites, setUnreadFavorites] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
            // Poll for notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }

        // Listen for internal events (e.g. toggled from ProductCard)
        window.addEventListener('favoritesUpdated', fetchUnreadCount);
        window.addEventListener('notificationsUpdated', fetchNotifications);
        return () => {
            window.removeEventListener('favoritesUpdated', fetchUnreadCount);
            window.removeEventListener('notificationsUpdated', fetchNotifications);
        };
    }, [session]);

    return (
        <nav className="fixed top-0 w-full z-50 px-4 pt-6">
            <div className={`max-w-7xl mx-auto glass-panel rounded-2xl px-6 py-3 flex items-center justify-between shadow-lg shadow-slate-200/50 border border-white/50 bg-white/80 backdrop-blur-md`}>
                <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:rotate-6">
                        <img src="/ethiopian-mascot.png" alt="Used Market Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col -space-y-1">
                        <span className="text-xl font-black text-slate-900 tracking-tighter">Used Market</span>
                        <span className="text-[11px] font-bold text-accent uppercase tracking-widest leading-none ml-0.5 italic">ከሰው እጅ</span>
                    </div>
                </Link>

                {/* Main Navigation */}
                <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    {!session ? (
                        <>
                            <Link href="/#pricing" className="hover:text-accent transition-colors">Pricing</Link>
                            <Link href="/#about" className="hover:text-accent transition-colors">About Us</Link>
                            <Link href="/dashboard" className="text-accent hover:underline decoration-2 underline-offset-4">Marketplace</Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/dashboard" className="hover:text-accent transition-colors">Marketplace</Link>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {status === "loading" ? (
                        <div className="w-10 h-10 bg-slate-100 rounded-full animate-pulse"></div>
                    ) : (
                        <div className="flex items-center gap-6">
                            {/* Action Icons with Labels - Visible to all, Guest triggers redirect */}
                            <div className="hidden sm:flex items-center gap-2 mr-2 border-r border-slate-100 pr-4">
                                <button
                                    onClick={() => {
                                        if (!session) {
                                            alert("Please register first to view favorites.");
                                            router.push('/auth/register');
                                        } else {
                                            router.push('/favorites');
                                        }
                                    }}
                                    className="flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-all group/nav relative"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover/nav:text-rose-500 transition-colors"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider group-hover/nav:text-slate-600">Favorites</span>
                                    {unreadFavorites > 0 && (
                                        <div className="absolute top-1.5 right-4 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-black animate-in zoom-in duration-300">
                                            {unreadFavorites}
                                        </div>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        if (!session) {
                                            alert("Please register first to access your store.");
                                            router.push('/auth/register');
                                        } else {
                                            router.push('/seller/mystore');
                                        }
                                    }}
                                    className="flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-all group/nav"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover/nav:text-accent transition-colors"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider group-hover/nav:text-slate-600">My Store</span>
                                </button>
                                {session && (
                                    <button
                                        onClick={() => {
                                            markAllAsRead();
                                            setIsSidebarOpen(true);
                                        }}
                                        className="flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-all group/nav relative"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover/nav:text-accent transition-colors"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider group-hover/nav:text-slate-600">Alerts</span>
                                        {unreadNotifications > 0 && (
                                            <div className="absolute top-1.5 right-3 w-4 h-4 bg-accent rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-black animate-pulse">
                                                {unreadNotifications}
                                            </div>
                                        )}
                                    </button>
                                )}
                            </div>

                            {session ? <ProfileDropdown /> : (
                                <div className="flex items-center gap-6">
                                    <Link href="/auth/login" className="text-[11px] font-black text-slate-600 hover:text-accent uppercase tracking-widest transition-colors">Log In</Link>
                                    <Link href="/auth/register">
                                        <Button className="!h-11 !px-8 rounded-xl font-black text-sm uppercase tracking-widest bg-slate-900 text-white hover:bg-accent border-none shadow-lg shadow-slate-200 transition-all hover:scale-105 active:scale-95">
                                            Join Now
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <NotificationSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                notifications={notifications}
                onMarkAllAsRead={markAllAsRead}
            />
        </nav>
    );
};
