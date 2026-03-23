"use client";

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiArrowRight } from "react-icons/fi";
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error('Failed to fetch admin stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-20 text-center flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12">
            <header>
                <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 mb-2">Platform <span className="text-indigo-600">Oversight</span></h1>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Administrator Dashboard</p>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    { label: 'Total Revenue', value: `${stats?.revenue?.toLocaleString() || 0} ETB`, color: 'bg-emerald-500 shadow-emerald-200', text: 'text-emerald-600' },
                    { label: 'Active Sellers', value: stats?.stores || 0, color: 'bg-indigo-600 shadow-indigo-200', text: 'text-indigo-600' },
                    { label: 'Market Products', value: stats?.products || 0, color: 'bg-slate-900 shadow-slate-200', text: 'text-slate-900' },
                    { label: 'Subscriptions', value: stats?.activeSubscriptions || 0, color: 'bg-rose-500 shadow-rose-200', text: 'text-rose-500' }
                ].map((stat) => (
                    <Card key={stat.label} className="p-6 md:p-8 rounded-[2rem] border-slate-100 shadow-sm bg-white hover:shadow-xl transition-all relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div className="space-y-1">
                                <div className={`text-3xl md:text-4xl font-black ${stat.text} tracking-tight`}>{stat.value}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</div>
                            </div>
                        </div>
                        <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full ${stat.color} opacity-5 group-hover:scale-150 transition-transform duration-500`} />
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                {/* Quick Actions / Shortcuts */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Management Hub</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link href="/admin/users" className="p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-indigo-200 hover:shadow-lg transition-all group flex items-start justify-between">
                                <div className="space-y-1 block">
                                    <h4 className="font-bold text-slate-900">Manage Users</h4>
                                    <p className="text-xs text-slate-400 font-medium">Verify roles, ban spans, edit emails.</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <FiArrowRight />
                                </div>
                            </Link>
                            <Link href="/admin/stores" className="p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-indigo-200 hover:shadow-lg transition-all group flex items-start justify-between">
                                <div className="space-y-1 block">
                                    <h4 className="font-bold text-slate-900">Manage Stores</h4>
                                    <p className="text-xs text-slate-400 font-medium">Review owner IDs, edit limits, verify sellers.</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <FiArrowRight />
                                </div>
                            </Link>
                            <Link href="/admin/products" className="p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-indigo-200 hover:shadow-lg transition-all group flex items-start justify-between">
                                <div className="space-y-1 block">
                                    <h4 className="font-bold text-slate-900">Moderate Content</h4>
                                    <p className="text-xs text-slate-400 font-medium">Clear out spam products or mark as sold.</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <FiArrowRight />
                                </div>
                            </Link>
                            <Link href="/admin/subscriptions" className="p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-indigo-200 hover:shadow-lg transition-all group flex items-start justify-between">
                                <div className="space-y-1 block">
                                    <h4 className="font-bold text-slate-900">Platform Plans</h4>
                                    <p className="text-xs text-slate-400 font-medium">Adjust plan limits globally or for specific users.</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <FiArrowRight />
                                </div>
                            </Link>
                        </div>
                    </section>
                </div>

                {/* System Status */}
                <div className="space-y-8">
                    <section>
                        <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight">System Status</h3>
                        <Card className="p-8 rounded-[2rem] bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
                            <ul className="space-y-6 relative z-10">
                                <li className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Auth Database</span>
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Image Content Delivery</span>
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">API Infrastructure</span>
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                                </li>
                            </ul>
                            <div className="absolute -bottom-6 -right-6 text-7xl opacity-5">⚙️</div>
                        </Card>
                    </section>
                </div>
            </div>
        </div>
    );
}
