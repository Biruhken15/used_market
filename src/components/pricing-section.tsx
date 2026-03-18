"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
        isUrgentEnabled: boolean;
        multipleLocations: boolean;
        customBranding: boolean;
    };
    metadata: {
        colorTheme: "emerald" | "blue" | "purple" | "gold" | "slate" | "orange";
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
                if (Array.isArray(data)) {
                    console.log("Subscription Plans Loaded:", data.map(p => p.planCode));
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

    if (loading) {
        return (
            <section className="w-full py-20 px-4 bg-white flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E91E63]"></div>
            </section>
        );
    }

    // Row 1: Free Trial and Pay-Per-Product
    const row1Plans = plans.filter(p => p.planCode === 'FREE_TRIAL' || p.planCode === 'PAY_PER_PRODUCT');
    // Row 2: All other seller plans
    const row2Plans = plans.filter(p => !['FREE_TRIAL', 'PAY_PER_PRODUCT', 'DEFAULT'].includes(p.planCode));

    return (
        <section id="pricing" className="w-full py-24 px-6 bg-[#F8F9FA]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
                        Choose Your <span className="text-[#E91E63]">Growth Plan</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
                        Transparent pricing tailored for every stage of your business.
                    </p>
                </div>

                {/* Row 1: Starter & Individual Plans */}
                <div className="flex flex-col md:flex-row justify-center gap-8 mb-12 max-w-3xl mx-auto">
                    {row1Plans.map((plan) => (
                        <div key={plan._id} className="w-full md:w-1/2">
                            <PlanCard plan={plan} />
                        </div>
                    ))}
                    {row1Plans.length === 1 && (
                        <div className="hidden md:block w-1/2" /> // Spacer if only one card exists
                    )}
                </div>

                {/* Row 2: Multi-Seller/Business Plans */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {row2Plans.map((plan) => (
                        <PlanCard key={plan._id} plan={plan} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function PlanCard({ plan }: { plan: Plan }) {
    const router = useRouter();
    return (
        <div
            className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col h-full transition-all hover:shadow-xl hover:-translate-y-1"
        >
            {/* Header Section */}
            <div className="p-8 pb-4 text-center">
                <h3 className="text-2xl font-bold text-slate-500 mb-2 uppercase tracking-tight">
                    {plan.planName.split(' ')[0]}
                </h3>
                <div className="flex flex-col items-center justify-center">
                    <div className="flex items-baseline">
                        <span className="text-4xl font-black text-slate-800">
                            {plan.price === 0 ? "Free" : plan.price.toLocaleString()}
                        </span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                        ETB / {plan.durationMonths === 12 ? 'Year' : plan.durationMonths === 1 ? 'Month' : `${plan.durationMonths} Months`}
                    </p>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-50 mx-4" />

            {/* Content Section */}
            <div className="p-8 pt-6 flex-grow flex flex-col space-y-8">
                {/* Plan Limit Section */}
                <div className="space-y-4">
                    <h4 className="text-[13px] font-bold text-slate-800 text-center mb-4">Plan Limit</h4>
                    <div className="space-y-3">
                        <LimitItem label={`${plan.limits.maxActiveListings > 1000 ? 'Unlimited' : plan.limits.maxActiveListings} Posts`} />
                        <LimitItem label={`${plan.limits.imagesPerProduct} Images Per Product`} />
                        <LimitItem label={`${plan.limits.listingDurationDays} Days Visibility`} />
                        <LimitItem label={`${plan.limits.maxStaffAccounts} Staff Accounts`} />
                        <LimitItem label={`${plan.limits.featuredListingsPerMonth} Featured Listings / Mo`} />
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-50 w-full" />

                {/* Plan Feature Section */}
                <div className="space-y-4 flex-grow">
                    <h4 className="text-[13px] font-bold text-slate-800 text-center mb-4">Plan Feature</h4>
                    <div className="space-y-3">
                        <FeatureItem label="Telegram Integration" active={plan.features.telegramEnabled} />
                        <FeatureItem label="Store Banner" active={plan.features.hasStoreBanner} />
                        <FeatureItem label="Verified Badge" active={plan.features.hasVerifiedBadge} />
                        <FeatureItem label="Multiple Locations" active={plan.features.multipleLocations} />
                        <FeatureItem label="Homepage Promotion" active={plan.features.hasHomepagePromotion} />
                        <FeatureItem label="Urgent Post Badge" active={plan.features.isUrgentEnabled} />
                        {plan.features.searchRankingBoost > 0 && (
                            <FeatureItem label={`Search Boost (${plan.features.searchRankingBoost}%)`} active={true} />
                        )}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-4 mt-auto flex flex-col items-center">
                    <p className="text-[11px] text-slate-400 font-medium text-center mb-4">
                        Designed for your {plan.planName.toLowerCase()} needs
                    </p>
                    <Button
                        onClick={async () => {
                            if (plan.planCode === 'PAY_PER_PRODUCT') {
                                router.push(`/seller/mystore/add-product?planCode=PAY_PER_PRODUCT&planId=${plan._id}`);
                            } else if (plan.planCode === 'FREE_TRIAL') {
                                try {
                                    const res = await fetch('/api/stores');
                                    const data = await res.json();
                                    if (data.store) {
                                        router.push('/seller/mystore');
                                    } else {
                                        router.push('/stores/create');
                                    }
                                } catch (error) {
                                    console.error("Error checking store:", error);
                                    router.push('/stores/create'); // Fallback to creation
                                }
                            } else {
                                router.push(`/seller/checkout?planId=${plan._id}`);
                            }
                        }}
                        className="px-8 bg-[#E91E63] hover:bg-[#D81B60] text-white rounded-full h-10 text-[11px] font-bold shadow-md shadow-pink-100 transition-all hover:scale-[1.05] active:scale-[0.95] uppercase tracking-wider"
                    >
                        Get Started
                    </Button>
                </div>
            </div>
        </div>
    );
}

function LimitItem({ label }: { label: string }) {
    return (
        <div className="flex items-center justify-start gap-3">
            <div className="flex-shrink-0">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <span className="text-[13px] font-medium text-slate-600">{label}</span>
            <div className="ml-auto flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
            </div>
        </div>
    );
}

function FeatureItem({ label, active }: { label: string, active: boolean }) {
    return (
        <div className="flex items-center justify-start gap-3 opacity-100">
            <div className="flex-shrink-0">
                <svg className={`w-4 h-4 ${active ? 'text-emerald-500' : 'text-slate-200'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? "3" : "2"}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <span className={`text-[13px] font-medium ${active ? 'text-slate-600' : 'text-slate-300 line-through'}`}>
                {label}
            </span>
            {active && (
                <div className="ml-auto flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                </div>
            )}
        </div>
    );
}
