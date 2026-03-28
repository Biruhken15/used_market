"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/common/navbar";
import { Bell, Info, AlertTriangle, CheckCircle, Gift, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
    const { data: session, status } = useSession();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        if (!session) return;
        try {
            const res = await fetch("/api/notifications");
            const data = await res.json();
            if (res.ok) {
                setNotifications(data.notifications);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
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
                setNotifications(notifications.map(n => ({ ...n, read: true })));
                // Trigger event to update navbar/bottomnav
                window.dispatchEvent(new Event('notificationsUpdated'));
            }
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    useEffect(() => {
        if (status === "unauthenticated") {
            redirect("/auth/login");
        }
        if (status === "authenticated") {
            fetchNotifications();
        }
    }, [status]);

    const getIcon = (type: string) => {
        const iconSize = 20;
        switch (type) {
            case 'payment_success': return <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle size={iconSize} /></div>;
            case 'subscription_expired': return <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center"><AlertTriangle size={iconSize} /></div>;
            case 'limit_reached': return <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center"><Info size={iconSize} /></div>;
            case 'new_feature': return <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"><Gift size={iconSize} /></div>;
            default: return <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center"><Bell size={iconSize} /></div>;
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-24">
            <Navbar />
            
            <div className="pt-32 px-4 max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors shadow-sm">
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Alerts</h1>
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-0.5">Protocol Updates</p>
                        </div>
                    </div>
                    {notifications.length > 0 && (
                        <button 
                            onClick={markAllAsRead}
                            className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors flex items-center gap-2"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <div 
                                key={notif._id}
                                className={`bg-white p-6 rounded-[2rem] border transition-all duration-300 relative overflow-hidden ${
                                    notif.read ? "border-slate-100 opacity-60" : "border-indigo-600/10 shadow-2xl shadow-indigo-100/30"
                                }`}
                            >
                                <div className="flex gap-5">
                                    <div className="shrink-0">
                                        {getIcon(notif.type)}
                                    </div>
                                    <div className="space-y-1 pr-8">
                                        <h3 className="text-[15px] font-black text-slate-900 tracking-tight leading-tight uppercase italic">{notif.title}</h3>
                                        <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{notif.message}</p>
                                        <div className="flex items-center gap-3 pt-2">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                {new Date(notif.createdAt).toLocaleDateString(undefined, {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                            {!notif.read && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 mx-auto mb-6">
                                <Bell size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tighter italic uppercase">No new alerts</h3>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Your protocol experience is clean.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
