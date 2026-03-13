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
        emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", btn: "bg-emerald-600 hover:bg-emerald-700" },
        blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", btn: "bg-blue-600 hover:bg-blue-700" },
        purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100", btn: "bg-purple-600 hover:bg-purple-700" },
        gold: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", btn: "bg-amber-600 hover:bg-amber-700" },
        slate: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-100", btn: "bg-slate-800 hover:bg-slate-900" },
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
                                className={`premium-card p-1 relative flex flex-col ${recommended ? 'shadow-2xl shadow-accent/20 border-accent ring-2 ring-accent/10 scale-[1.05] z-10' : ''}`}
                            >
                                {recommended && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
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

                                    <div className="mb-10 flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-slate-900">{(plan.price ?? 0).toLocaleString()}</span>
                                        <span className="text-slate-400 font-bold text-sm uppercase">ETB / {plan.durationMonths === 1 ? 'mo' : plan.durationMonths === 3 ? '3mo' : 'yr'}</span>
                                    </div>

                                    <div className="space-y-4 mb-10 flex-grow">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-xs font-bold p-3 bg-slate-50 rounded-xl">
                                                <span className="text-slate-400 uppercase tracking-widest">Listings</span>
                                                <span className="text-slate-900">{plan.limits.maxActiveListings > 1000 ? 'Unlimited' : plan.limits.maxActiveListings}</span>
                                            </div>
                                            {plan.features.searchRankingBoost > 0 && (
                                                <div className="flex justify-between items-center text-xs font-bold p-3 bg-accent/5 rounded-xl border border-accent/10">
                                                    <span className="text-accent uppercase tracking-widest">Boost</span>
                                                    <span className="text-accent">+{plan.features.searchRankingBoost}%</span>
                                                </div>
                                            )}
                                        </div>

                                        <ul className="space-y-3 pt-2">
                                            {[
                                                { text: `${plan.limits.imagesPerProduct} Images per Listing`, included: true },
                                                { text: 'Verified Store Badge', included: plan.features.hasVerifiedBadge },
                                                { text: 'Premium Analytics', included: plan.features.hasAnalytics },
                                                { text: 'Bulk List Tools', included: plan.features.hasBulkUpload },
                                                { text: 'Store Banner', included: plan.features.hasStoreBanner },
                                                { text: 'Priority Support', included: plan.features.hasPrioritySupport },
                                                { text: 'Telegram & Phone', included: plan.features.telegramEnabled || plan.features.phoneEnabled },
                                                { text: 'WhatsApp Direct', included: plan.features.whatsappEnabled },
                                            ].filter((f, i) => {
                                                // Only show 6 relevant features to keep it clean
                                                if (plan.planCode === 'FREE_TRIAL') return i < 4;
                                                return true;
                                            }).slice(0, 6).map((feature, idx) => (
                                                <li key={idx} className={`flex items-center gap-3 text-[11px] font-bold ${feature.included ? 'text-slate-600' : 'text-slate-300'}`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={feature.included ? 'text-emerald-500' : 'text-slate-200'}><polyline points="20 6 9 17 4 12" /></svg>
                                                    {feature.text}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <Button
                                        onClick={() => router.push(`/seller/checkout?planId=${plan._id}`)}
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
