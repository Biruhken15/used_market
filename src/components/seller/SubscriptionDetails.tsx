"use client";

import Link from "next/link";

// Custom high-fidelity CheckIcon to replace lucide-react
const CheckIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

interface PlanFeature {
    [key: string]: any;
}

interface SubscriptionDetailsProps {
    subscription: any;
    plan: any;
}

import { Shield, Zap, Users, Package, Image as ImageIcon, Calendar, ArrowUpRight, CheckCircle2, Clock, Fingerprint } from "lucide-react";

interface SubscriptionDetailsProps {
    subscription: any;
    plan: any;
}

export function SubscriptionDetails({ subscription, plan }: SubscriptionDetailsProps) {
    if (!plan) return (
        <div className="bg-white p-12 rounded-[3.5rem] border-2 border-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-4xl mx-auto mb-6 border border-slate-100 italic font-black shadow-inner">
                ?
            </div>
            <div className="space-y-3">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">No Protocol Active</h3>
                <p className="text-slate-500 font-bold max-w-sm mx-auto text-sm leading-relaxed">Upgrade your identity to a merchant tier to unlock professional trade capabilities.</p>
            </div>
            <Link href="/pricing" className="block max-w-xs mx-auto">
                <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-violet-600 transition-all active:scale-95 flex items-center justify-center gap-3 border-none">
                    Initialize Upgrade
                    <ArrowUpRight size={18} strokeWidth={3} />
                </button>
            </Link>
        </div>
    );

    const startDate = new Date(subscription?.currentPeriodStart || subscription?.createdAt);
    const expiryDate = new Date(subscription?.currentPeriodEnd);
    const isExpired = new Date() > expiryDate || subscription?.status === 'expired';
    const isCanceled = subscription?.status === 'canceled';
    const daysRemaining = Math.max(0, Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

    const limits = [
        { label: "Active Listings", current: 0, max: plan.limits.maxActiveListings, icon: Package, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Image Protocol", current: 0, max: plan.limits.imagesPerProduct, icon: ImageIcon, color: "text-purple-500", bg: "bg-purple-50" },
        { label: "Staff Access", current: 0, max: plan.limits.maxStaffAccounts, icon: Users, color: "text-emerald-500", bg: "bg-emerald-50" },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Ultra Modern Plan Hero */}
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[3.5rem] translate-x-3 translate-y-3 -z-10 opacity-10 group-hover:opacity-20 transition-opacity" />
                <div className="bg-slate-900 rounded-[3.5rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl border border-white/10">
                    {/* Glass Decorations */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                        <div className="space-y-6 max-w-xl">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl">
                                <div className={`w-2 h-2 rounded-full ${isExpired ? 'bg-rose-500' : 'bg-emerald-500'} animate-pulse`} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                                    {isExpired ? 'Protocol Suspended' : 'System Operational'}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic text-white font-serif leading-none">
                                    {plan.planName.split(' ')[0]} <span className="text-indigo-400">{plan.planName.split(' ')[1] || 'TIER'}</span>
                                </h2>
                                <p className="text-slate-400 font-bold text-lg italic tracking-tight">{plan.metadata?.tagline || "Your current merchant intelligence level."}</p>
                            </div>
                            
                            <div className="flex flex-wrap gap-6 pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                                        <Clock size={16} />
                                    </div>
                                    <div className="">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Access Remainder</p>
                                        <p className="text-base font-black text-white">{daysRemaining} DAYS</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                                        <Fingerprint size={16} />
                                    </div>
                                    <div className="">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Identity Tag</p>
                                        <p className="text-base font-black text-white uppercase italic">{plan.planCode}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 text-center min-w-[240px] shadow-2xl">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Protocol Fee</p>
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-5xl font-black font-serif italic">{plan.price.toLocaleString()}</span>
                                <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">ETB</span>
                            </div>
                            <p className="text-[9px] font-bold text-slate-500 uppercase mt-4 tracking-widest">
                                Billed {subscription.billingCycle}
                            </p>
                            <Link href="/pricing" className="mt-8 block">
                                <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5 border-none">
                                    Enhance Tier
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Protocol Limits Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {limits.map((limit, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`w-12 h-12 rounded-2xl ${limit.bg} ${limit.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <limit.icon size={20} strokeWidth={2.5} />
                            </div>
                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Protocol Check</div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{limit.label}</h4>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-slate-950">{limit.max === 9999 ? 'UNLIMITED' : limit.max}</span>
                                    {limit.max !== 9999 && <span className="text-xs font-bold text-slate-300 uppercase">Capacity</span>}
                                </div>
                            </div>
                            {/* Modern Progress Indicator */}
                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                                <div 
                                    className={`h-full transition-all duration-1000 bg-gradient-to-r from-slate-800 to-slate-950`}
                                    style={{ width: limit.max === 9999 ? '100%' : '15%' }} // Simulated current usage
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tier Permissions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                    <div className="flex justify-between items-center mb-10 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center">
                                <Shield size={18} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-xl font-black tracking-tight text-slate-900 uppercase italic">Active Permissions</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 relative z-10">
                        {Object.entries(plan.features).filter(([_, enabled]) => enabled === true).map(([key, _]) => (
                            <div key={key} className="flex items-center gap-4 group/item">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover/item:scale-150 transition-transform" />
                                <span className="text-xs font-black text-slate-700 uppercase tracking-widest italic group-hover/item:text-slate-950 transition-colors">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Expiry / Timeline */}
                <div className="bg-slate-50 border border-slate-200 rounded-[3.5rem] p-10 flex flex-col justify-between group">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Calendar className="text-slate-400" size={20} />
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Protocol Timeline</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-white rounded-2xl border border-slate-200">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Initialized On</p>
                                <p className="text-xs font-bold text-slate-900">{startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                            <div className={`p-4 rounded-2xl border ${isExpired ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'}`}>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Termination Threshold</p>
                                <p className="text-xs font-bold text-slate-900">{expiryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                        </div>
                    </div>
                    <div className="pt-8">
                        <div className="flex items-center gap-2 mb-2">
                             <CheckCircle2 size={12} className="text-emerald-500" />
                             <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Network Verified</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 leading-relaxed">System protocol will remain active until the threshold is crossed.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
