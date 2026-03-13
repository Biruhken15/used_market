'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { X, Bell, Info, AlertTriangle, CheckCircle, Gift, ArrowRight } from 'lucide-react';

interface Notification {
    _id: string;
    type: 'subscription_expired' | 'limit_reached' | 'payment_success' | 'system_alert' | 'new_feature';
    title: string;
    message: string;
    createdAt: string;
}

interface NotificationSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    onMarkAllAsRead: () => void;
}

export const NotificationSidebar = ({ isOpen, onClose, notifications, onMarkAllAsRead }: NotificationSidebarProps) => {
    const getIcon = (type: string) => {
        const iconSize = 16;
        switch (type) {
            case 'payment_success': return <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle size={iconSize} /></div>;
            case 'subscription_expired': return <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center"><AlertTriangle size={iconSize} /></div>;
            case 'limit_reached': return <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><Info size={iconSize} /></div>;
            case 'new_feature': return <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Gift size={iconSize} /></div>;
            default: return <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center"><Bell size={iconSize} /></div>;
        }
    };

    return (
        <>
            {/* Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-full sm:w-[380px] bg-white z-[101] shadow-[-20px_0_50px_-20px_rgba(0,0,0,0.15)] border-l border-slate-100 transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 bg-white/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                                <Bell size={20} className="animate-swing" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-900 tracking-tighter">Alerts</h2>
                                <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Protocol Live</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center p-0 rounded-xl border-slate-200 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                        >
                            <X size={18} />
                        </Button>
                    </div>

                    {/* Notification List */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <div
                                    key={notif._id}
                                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden"
                                >
                                    <div className="flex gap-3">
                                        <div className="shrink-0">{getIcon(notif.type)}</div>
                                        <div className="space-y-0.5">
                                            <h3 className="text-[13px] font-black text-slate-900 tracking-tight leading-tight">{notif.title}</h3>
                                            <p className="text-[11px] text-slate-500 font-medium leading-normal">{notif.message}</p>
                                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest pt-1">
                                                {new Date(notif.createdAt).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-40">
                                <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 border-2 border-dashed border-slate-200">
                                    <Bell size={24} />
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Protocol Clean</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes swing {
                    0% { transform: rotate(0deg); }
                    10% { transform: rotate(10deg); }
                    30% { transform: rotate(-10deg); }
                    50% { transform: rotate(10deg); }
                    100% { transform: rotate(0deg); }
                }
                .animate-swing {
                    animation: swing 2s infinite ease-in-out;
                }
            `}</style>
        </>
    );
};
