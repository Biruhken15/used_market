"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface Plan {
    _id: string;
    planCode: string;
    planName: string;
    price: number;
    durationMonths: number;
    limits: {
        maxActiveListings: number;
        imagesPerProduct: number;
        maxStaffAccounts: number;
        featuredListingsPerMonth: number;
        listingDurationDays: number;
        urgentDurationDays?: number;
    };
    features: {
        canMarkAsSold: boolean;
        hasAnalytics: boolean;
        analyticsLevel: string;
        hasStoreBanner: boolean;
        hasVerifiedBadge: boolean;
        hasBulkUpload: boolean;
        telegramEnabled: boolean;
        phoneEnabled: boolean;
        whatsappEnabled: boolean;
        searchRankingBoost: number;
        hasApiAccess: boolean;
        hasPrioritySupport: boolean;
        hasHomepagePromotion: boolean;
        multipleLocations: boolean;
        customBranding: boolean;
        canMarkAsUrgent?: boolean;
    };
    metadata: {
        colorTheme: "emerald" | "blue" | "purple" | "gold" | "slate";
        tagline: string;
    };
}

export default function PricingSection() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await fetch('/api/subscriptions/plans');
                const data = await res.json();
                console.log('Fetched Plans:', data);
                if (Array.isArray(data)) {
                    setPlans(data);
                }
            } catch (error) {
                console.error("Failed to fetch plans:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const themeColors: Record<string, { bg: string, text: string, border: string, btn: string }> = {
        emerald: { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-100", btn: "bg-pink-600 hover:bg-pink-700 shadow-pink-100" },
        blue: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100", btn: "bg-violet-600 hover:bg-violet-700 shadow-violet-100" },
        purple: { bg: "bg-fuchsia-100", text: "text-fuchsia-600", border: "border-fuchsia-200", btn: "bg-gradient-to-r from-violet-600 to-pink-600 hover:brightness-110 shadow-indigo-100" },
        gold: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", btn: "bg-amber-600 hover:bg-amber-700 shadow-amber-100" },
        slate: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-100", btn: "bg-slate-950 hover:bg-black shadow-slate-200" },
    };

    if (loading) {
        return (
            <section className="w-full py-20 px-4 bg-white flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </section>
        );
    }

    return (
        <section id="pricing" className="w-full py-32 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-lg border border-accent/20">
                        <span className="text-[10px] font-black uppercase tracking-widest text-accent">Monetize Your Store</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                        Simple, Professional <span className="gradient-text">Pricing.</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
                        Choose the plan that fits your business scale. No hidden fees, just growth.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((plan) => {
                        const theme = themeColors[plan.metadata.colorTheme] || themeColors.blue;
                        const recommended = plan.planCode === 'PRO_SELLER';

                        return (
                            <div
                                key={plan._id}
                                className={`premium-card p-1 relative flex flex-col ${recommended ? 'shadow-2xl shadow-indigo-100/50 border-violet-500 ring-4 ring-violet-500/10 scale-[1.05] z-10' : ''}`}
                            >
                                {recommended && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-pink-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-200">
                                        Best Value
                                    </div>
                                )}

                                <div className="p-8 flex-grow flex flex-col">
                                    <div className="mb-8">
                                        <div className={`w-10 h-10 ${theme.bg} ${theme.text} rounded-xl flex items-center justify-center text-xl mb-4`}>
                                            {plan.planCode === 'FREE_TRIAL' ? '🌱' : plan.planCode === 'BASIC_SELLER' ? '🚀' : plan.planCode === 'PRO_SELLER' ? '💎' : '👑'}
                                        </div>
                                        <h3 className="text-xl font-extrabold text-slate-900">{plan.planName}</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{plan.metadata.tagline}</p>
                                    </div>

                                    <div className="mb-8 flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-slate-900">{(plan.price ?? 0).toLocaleString()}</span>
                                        <span className="text-slate-400 font-bold text-sm uppercase">ETB / {plan.durationMonths === 1 ? 'mo' : plan.durationMonths === 6 ? '6mo' : plan.durationMonths === 12 ? 'yr' : `${plan.durationMonths}mo`}</span>
                                    </div>

                                    <div className="space-y-6 mb-10 flex-grow">
                                        {/* LIMITS SECTION */}
                                        <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 border-b border-slate-200/60 pb-2">Usage Limits</h4>
                                            
                                            <div className="flex justify-between items-center text-[11px] font-bold">
                                                <span className="text-slate-500">Active Listings</span>
                                                <span className="text-slate-900 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-100">{plan.limits.maxActiveListings > 1000 ? 'Unlimited' : plan.limits.maxActiveListings}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[11px] font-bold">
                                                <span className="text-slate-500">Images Per Listing</span>
                                                <span className="text-slate-900 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-100">{plan.limits.imagesPerProduct}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[11px] font-bold">
                                                <span className="text-slate-500">Staff Accounts</span>
                                                <span className="text-slate-900 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-100">{plan.limits.maxStaffAccounts}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[11px] font-bold">
                                                <span className="text-slate-500">Listing Duration</span>
                                                <span className="text-slate-900 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-100">{plan.limits.listingDurationDays} Days</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[11px] font-bold">
                                                <span className="text-slate-500">Featured Slots / mo</span>
                                                <span className="text-slate-900 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-100">{plan.limits.featuredListingsPerMonth}</span>
                                            </div>
                                            {plan.limits.urgentDurationDays ? (
                                                <div className="flex justify-between items-center text-[11px] font-bold">
                                                    <span className="text-slate-500">Urgent Tag Duration</span>
                                                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shadow-sm border border-emerald-100">{plan.limits.urgentDurationDays} Days</span>
                                                </div>
                                            ) : null}
                                        </div>

                                        {/* FEATURES SECTION */}
                                        <div className="space-y-4 px-2">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Included Features</h4>
                                            <ul className="space-y-3">
                                                {(() => {
                                                    const allFeatures = [
                                                        { text: "Custom Store Banner", included: plan.features.hasStoreBanner },
                                                        { text: "Mark items as Sold", included: plan.features.canMarkAsSold },
                                                        { text: "Analytics Dashboard", included: plan.features.hasAnalytics },
                                                        { text: "Verified Store Badge", included: plan.features.hasVerifiedBadge },
                                                        { text: "Urgent Priorities", included: plan.features.canMarkAsUrgent },
                                                        { text: "Multiple Locations", included: plan.features.multipleLocations },
                                                        { text: "Telegram & Phone Sync", included: plan.features.telegramEnabled || plan.features.phoneEnabled },
                                                        { text: "WhatsApp Direct Link", included: plan.features.whatsappEnabled },
                                                        { text: "Priority 24/7 Support", included: plan.features.hasPrioritySupport },
                                                        { text: "Custom Store Branding", included: plan.features.customBranding },
                                                        { text: `+${plan.features.searchRankingBoost || 0}% Search Ranking Boost`, included: (plan.features.searchRankingBoost || 0) > 0 },
                                                    ];

                                                    return allFeatures.map((f, i) => (
                                                        <li key={i} className={`flex items-start gap-3 text-[11px] font-bold leading-tight ${f.included ? 'text-slate-700' : 'text-slate-300 line-through opacity-60'}`}>
                                                            {f.included ? (
                                                                <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><polyline points="20 6 9 17 4 12" /></svg>
                                                                </div>
                                                            ) : (
                                                                <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                                                </div>
                                                            )}
                                                            <span className="flex-1 pt-0.5">{f.text}</span>
                                                        </li>
                                                    ));
                                                })()}
                                            </ul>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => router.push('/stores/create')}
                                        className={`w-full !h-10 rounded-xl font-medium text-[11px] uppercase tracking-widest text-white border-none transition-all ${theme.btn} shadow-lg shadow-slate-100`}
                                    >
                                        Get Started
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
