"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    Home, 
    Search, 
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
    const { data: session } = useSession();
    const { unreadTotal } = useChatContext();
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [unreadFavorites, setUnreadFavorites] = useState(0);

    const fetchData = async () => {
        if (!session) return;
        try {
            // Fetch notifications
            const notifRes = await fetch("/api/notifications");
            const notifData = await notifRes.json();
            if (notifRes.ok) setUnreadNotifications(notifData.unreadCount);

            // Fetch favorites
            const favRes = await fetch("/api/favorites");
            const favData = await favRes.json();
            if (favRes.ok) setUnreadFavorites(favData.unreadCount || 0);
        } catch (error) {
            console.error("Error fetching bottom nav data:", error);
        }
    };

    useEffect(() => {
        if (session) {
            fetchData();
            const interval = setInterval(fetchData, 30000);
            return () => clearInterval(interval);
        }
    }, [session]);

    useEffect(() => {
        window.addEventListener('favoritesUpdated', fetchData);
        window.addEventListener('notificationsUpdated', fetchData);
        return () => {
            window.removeEventListener('favoritesUpdated', fetchData);
            window.removeEventListener('notificationsUpdated', fetchData);
        };
    }, [session]);

    const navItems: { icon: any, label: string, href: string, badge?: number }[] = [
        { icon: Home, label: "Home", href: "/" },
        { icon: Heart, label: "Saved", href: "/favorites", badge: unreadFavorites },
        { icon: MessageCircle, label: "Chat", href: "/chat", badge: unreadTotal },
        { icon: Store, label: "My Store", href: "/seller/mystore" },
        { icon: Bell, label: "Alerts", href: "/notifications", badge: unreadNotifications },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6">
            <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/60 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-between px-3 py-2.5">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link 
                            key={item.label} 
                            href={item.href}
                            className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 ${isActive ? 'text-violet-600' : 'text-slate-400'}`}
                        >
                            <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-white shadow-md shadow-violet-100/50 scale-110' : 'bg-transparent'}`}>
                                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                            </div>
                            <span className={`text-[10px] font-semibold tracking-tight mt-1.5 transition-colors ${isActive ? 'text-violet-600' : 'text-slate-500'}`}>
                                {item.label}
                            </span>
                            {item.badge !== undefined && item.badge > 0 && (
                                <div className="absolute top-1 right-1/2 translate-x-4 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-black shadow-sm">
                                    {item.badge}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
