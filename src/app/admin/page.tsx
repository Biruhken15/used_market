"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/common/navbar';

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated' || (session && (session.user as any).role !== 'admin')) {
            router.push('/');
        } else if (session) {
            fetchStats();
        }
    }, [session, status]);

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

    if (loading) return <div className="p-20 text-center font-black uppercase text-xs tracking-widest text-foreground/20">Securing Platform...</div>;

    return (
        <main className="min-h-screen bg-[#fcfcfc]">
            <Navbar />

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-2">Platform <span className="text-blue-600">Oversight</span></h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Administrator Control Panel</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Revenue', value: `${stats.revenue.toLocaleString()} ETB`, color: 'bg-emerald-500 shadow-emerald-200' },
                        { label: 'Active Sellers', value: stats.stores, color: 'bg-blue-600 shadow-blue-200' },
                        { label: 'Market Products', value: stats.products, color: 'bg-slate-900 shadow-slate-200' },
                        { label: 'Subscriptions', value: stats.activeSubscriptions, color: 'bg-indigo-600 shadow-indigo-200' }
                    ].map((stat) => (
                        <Card key={stat.label} className="p-8 rounded-[2.5rem] border-none shadow-xl bg-white relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="text-4xl font-black text-slate-900 mb-1">{stat.value}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</div>
                            </div>
                            <div className={`absolute top-0 right-0 w-2 h-full ${stat.color} opacity-20`} />
                        </Card>
                    ))}
                </div>

                <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black text-slate-900 italic">Recent Stores</h3>
                                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50">View All Stores</Button>
                            </div>
                            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-8 text-center text-slate-400 font-bold text-sm italic">
                                    Integration Pending: Store management UI will appear here.
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-8">
                        <section>
                            <h3 className="text-xl font-black text-slate-900 mb-6 italic tracking-tight">System Status</h3>
                            <Card className="p-8 rounded-[2.5rem] bg-slate-900 text-white border-none shadow-2xl">
                                <ul className="space-y-6">
                                    <li className="flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Auth Service</span>
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Payment Proxy</span>
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">DB Sync</span>
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                                    </li>
                                </ul>
                            </Card>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
