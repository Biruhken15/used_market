"use client";

import React from 'react';

interface StoreInsightsProps {
    metrics: Record<string, number>;
    recentActivity: any[];
    planName: string;
    isProOrEnterprise: boolean;
}

const Icons = {
    Eye: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
    ),
    BarChart: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg>
    ),
    MousePointer: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z" /><path d="m13 13 6 6" /></svg>
    ),
    Phone: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.81 12.81 0 0 0 .62 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.18-2.18a2 2 0 0 1 2.11-.45 12.81 12.81 0 0 0 2.81.62A2 2 0 0 1 22 16.92z" /></svg>
    ),
    TrendingUp: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
    ),
    Activity: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
    ),
    Lock: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
    )
};

export default function StoreInsights({ metrics, recentActivity, planName, isProOrEnterprise }: StoreInsightsProps) {
    const stats = [
        {
            label: "Store Views",
            value: metrics.store_view || 0,
            icon: Icons.Eye,
            color: "text-blue-600",
            bg: "bg-blue-50",
            description: "Total profile visits"
        },
        {
            label: "Product Views",
            value: metrics.product_view || 0,
            icon: Icons.BarChart,
            color: "text-purple-600",
            bg: "bg-purple-50",
            description: "Listing engagement"
        },
        {
            label: "Contact Clicks",
            value: metrics.contact_click || 0,
            icon: Icons.Phone,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            description: "Direct lead generation"
        },
        {
            label: "Search Impressions",
            value: metrics.search_impression || 0,
            icon: Icons.MousePointer,
            color: "text-amber-600",
            bg: "bg-amber-50",
            description: "Visibility in search"
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Performance Intelligence</h2>
                    <p className="text-slate-500 font-medium italic mt-1">Unified analytics for your digital storefront.</p>
                </div>
                <div className="px-5 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-slate-200">
                    Live Data Protocol Active
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="premium-card p-6 bg-white space-y-4 hover:border-blue-200 transition-all group">
                        <div className="flex items-start justify-between">
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon />
                            </div>
                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">REAL-TIME</div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{stat.value.toLocaleString()}</h3>
                            <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-wider">{stat.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Placeholder / Activity Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth Trend */}
                <div className="lg:col-span-2 premium-card p-8 bg-white relative overflow-hidden group">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="flex justify-between items-center mb-10 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                                <Icons.TrendingUp />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Weekly Engagement</h3>
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aggregation: 7 Days</span>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-2 px-2">
                        {[0.4, 0.7, 0.5, 0.9, 0.6, 1.0, 0.8].map((v, i) => (
                            <div key={i} className="flex-1 group relative">
                                <div
                                    className="w-full bg-accent/20 rounded-t-lg group-hover:bg-accent transition-all duration-300"
                                    style={{ height: `${v * 100}%` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {Math.floor(v * 250)} Views
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                    </div>
                </div>

                {/* Activity Log (Gated for Pro/Enterprise) */}
                <div className="premium-card p-8 bg-white flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                                <Icons.Activity />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Activity</h3>
                        </div>
                    </div>

                    <div className="flex-1 space-y-6">
                        {isProOrEnterprise ? (
                            recentActivity.length > 0 ? (
                                recentActivity.map((activity: any, idx) => (
                                    <div key={idx} className="flex gap-4 group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 group-hover:scale-150 transition-transform" />
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{activity.type.replace('_', ' ')}</p>
                                            <p className="text-xs font-medium text-slate-400">
                                                {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {activity.location?.city || "Unknown"}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-sm font-bold text-slate-300">No recent activity.</p>
                                </div>
                            )
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200">
                                    <Icons.Lock />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Detailed Activity Gated</p>
                                    <p className="text-xs font-medium text-slate-400 px-4">Upgrade to Pro or Enterprise to see active viewer locations and timestamps.</p>
                                </div>
                                <button className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">
                                    Explore Plans
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
