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

export const BottomNav = ({ unreadNotifications = 0, unreadFavorites = 0 }) => {
    const pathname = usePathname();
    const { unreadTotal } = useChatContext();

    const navItems: { icon: any, label: string, href: string, badge?: number }[] = [
        { icon: Home, label: "Home", href: "/" },
        { icon: Search, label: "Explore", href: "/products" },
        { icon: Heart, label: "Saved", href: "/favorites", badge: unreadFavorites },
        { icon: MessageCircle, label: "Chat", href: "/chat", badge: unreadTotal },
        { icon: Store, label: "My Store", href: "/seller/mystore" },
        { icon: Bell, label: "Alerts", href: "/notifications", badge: unreadNotifications },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-2xl shadow-slate-200/50 flex items-center justify-between px-2 py-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link 
                            key={item.label} 
                            href={item.href}
                            className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 ${isActive ? 'text-violet-600' : 'text-slate-400'}`}
                        >
                            <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-violet-50' : ''}`}>
                                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-tighter mt-0.5 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                                {item.label}
                            </span>
                            {item.badge !== undefined && item.badge > 0 && (
                                <div className="absolute top-1 right-1/2 translate-x-3 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-black">
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
