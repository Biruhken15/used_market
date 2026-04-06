"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
    Home, 
    Heart, 
    Store, 
    Bell,
    MessageCircle 
} from "lucide-react";
import { useChatContext } from "@/components/chat/ChatManager";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export const BottomNav = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const { unreadTotal } = useChatContext();
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [unreadFavorites, setUnreadFavorites] = useState(0);

    const fetchData = async (signal?: AbortSignal) => {
        if (!session) return;
        try {
            // 1. Fetch Notifications
            const notifRes = await fetch("/api/notifications", { signal });
            if (notifRes.ok) {
                const notifData = await notifRes.json();
                setUnreadNotifications(notifData.unreadCount || 0);
            }

            // 2. Fetch Favorites
            const favRes = await fetch("/api/favorites", { signal });
            if (favRes.ok) {
                const favData = await favRes.json();
                setUnreadFavorites(favData.unreadCount || 0);
            }
        } catch (error: any) {
            if (error.name === 'AbortError') return;
            console.error("Error fetching bottom nav data:", error);
        }
    };

    useEffect(() => {
        if (session) {
            const controller = new AbortController();
            fetchData(controller.signal);

            const interval = setInterval(() => fetchData(controller.signal), 30000);
            return () => {
                controller.abort();
                clearInterval(interval);
            };
        }
    }, [session]);

    useEffect(() => {
        const handleEventRefresh = () => fetchData();
        window.addEventListener('favoritesUpdated', handleEventRefresh);
        window.addEventListener('notificationsUpdated', handleEventRefresh);
        return () => {
            window.removeEventListener('favoritesUpdated', handleEventRefresh);
            window.removeEventListener('notificationsUpdated', handleEventRefresh);
        };
    }, [session]);

    // Guard: redirect guests to login with callbackUrl instead of hitting middleware
    const handleProtectedNav = (href: string) => {
        if (!session) {
            router.push(`/auth/login?callbackUrl=${encodeURIComponent(href)}`);
            return;
        }
        router.push(href);
    };

    const navItems = [
        {
            icon: Home,
            label: "Home",
            href: "/",
            badge: undefined,
            protected: false,
        },
        {
            icon: Heart,
            label: "Saved",
            href: "/favorites",
            badge: unreadFavorites,
            protected: true,
        },
        {
            icon: MessageCircle,
            label: "Chat",
            href: "/chat",
            badge: unreadTotal,
            protected: true,
        },
        {
            icon: Store,
            label: "My Store",
            href: "/seller/mystore",
            badge: undefined,
            protected: true,
        },
        {
            icon: Bell,
            label: "Alerts",
            href: "/notifications",
            badge: unreadNotifications,
            protected: true,
        },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-6">
            <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/80 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] flex items-center justify-around px-2 py-3">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.label}
                            onClick={() => item.protected ? handleProtectedNav(item.href) : router.push(item.href)}
                            className={`relative flex flex-col items-center justify-center min-w-[64px] transition-colors py-1 ${isActive ? 'text-violet-600' : 'text-slate-400'}`}
                        >
                            <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-violet-50 text-violet-600' : 'bg-transparent'}`}>
                                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
                                {!session && item.protected && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-slate-200 rounded-full flex items-center justify-center border-2 border-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" strokeWidth="3"/></svg>
                                    </div>
                                )}
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest mt-1.5 transition-colors ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                                {item.label}
                            </span>
                            {item.badge !== undefined && item.badge > 0 && (
                                <div className="absolute top-1 right-2 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-black animate-pulse">
                                    {item.badge}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
