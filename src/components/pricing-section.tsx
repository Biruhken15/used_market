"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface PlanFeature {
    text: string;
    included: boolean;
    highlight?: boolean;
}

interface Plan {
    id: string;
    name: string;
    pricing: string;
    billingText: string;
    tagline: string;
    recommended?: boolean;
    color: "emerald" | "blue" | "purple" | "gold";
    limits: {
        listings: string;
        images: number;
        staff: number;
        featured: number;
        duration: string;
    };
    features: PlanFeature[];
}

export default function PricingSection() {
    const plans: Plan[] = [
        {
            id: "FREE_TRIAL",
            name: "Free Trial",
            pricing: "0",
            billingText: "Free forever",
            tagline: "Try before you buy",
            color: "emerald",
            limits: {
                listings: "3 Listings",
                images: 3,
                staff: 1,
                featured: 0,
                duration: "60 Days",
            },
            features: [
                { text: "Telegram Enabled", included: true },
                { text: "Phone Support", included: true },
                { text: "Basic Search Ranking", included: true },
                { text: "Advanced Analytics", included: false },
                { text: "Verified Badge", included: false },
                { text: "WhatsApp Enabled", included: false },
            ],
        },
        {
            id: "BASIC_SELLER",
            name: "Basic Seller",
            pricing: "500",
            billingText: "per month",
            tagline: "Perfect for starting out",
            color: "blue",
            limits: {
                listings: "20 Listings",
                images: 5,
                staff: 2,
                featured: 0,
                duration: "60 Days",
            },
            features: [
                { text: "Basic Analytics", included: true },
                { text: "Store Banner", included: true },
                { text: "Search Ranking Boost (10%)", included: true },
                { text: "Verified Badge", included: false },
                { text: "Bulk Upload", included: false },
                { text: "Multiple Locations", included: false },
            ],
        },
        {
            id: "PRO_SELLER",
            name: "Pro Seller",
            pricing: "4,800",
            billingText: "per quarter",
            tagline: "For serious sellers",
            recommended: true,
            color: "purple",
            limits: {
                listings: "100 Listings",
                images: 10,
                staff: 3,
                featured: 5,
                duration: "90 Days",
            },
            features: [
                { text: "Advanced Analytics", included: true, highlight: true },
                { text: "Verified Badge", included: true, highlight: true },
                { text: "Bulk Upload Tools", included: true },
                { text: "WhatsApp Enabled", included: true },
                { text: "Sold Items Archive", included: true },
                { text: "Search Ranking Boost (25%)", included: true },
            ],
        },
        {
            id: "ENTERPRISE_SELLER",
            name: "Enterprise",
            pricing: "22,000",
            billingText: "per year",
            tagline: "For high-volume stores",
            color: "gold",
            limits: {
                listings: "Unlimited Listings",
                images: 15,
                staff: 5,
                featured: 20,
                duration: "Unlimited",
            },
            features: [
                { text: "Custom Branding", included: true, highlight: true },
                { text: "API Access", included: true },
                { text: "Priority Support 24/7", included: true },
                { text: "Homepage Promotion", included: true },
                { text: "Multiple Locations", included: true },
                { text: "Search Ranking Boost (50%)", included: true },
            ],
        },
    ];

    const planStyles = {
        emerald: "border-emerald-600 shadow-emerald-50",
        blue: "border-blue-600 shadow-blue-50",
        purple: "border-purple-600 shadow-purple-50",
        gold: "border-amber-500 shadow-amber-50",
    };

    const buttonStyles = {
        emerald: "bg-emerald-600 hover:bg-emerald-700",
        blue: "bg-blue-600 hover:bg-blue-700",
        purple: "bg-purple-600 hover:bg-purple-700",
        gold: "bg-amber-500 hover:bg-amber-600",
    };

    const dotStyles = {
        emerald: "bg-emerald-600",
        blue: "bg-blue-600",
        purple: "bg-purple-600",
        gold: "bg-amber-500",
    };

    return (
        <section className="w-full py-20 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16 space-y-3">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        Subscription <span className="text-blue-600">Plans</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto">
                        Clear, transparent pricing for Ethiopian businesses.
                    </p>
                </div>

                {/* Compact 4-column layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {plans.map((plan) => {
                        const style = planStyles[plan.color];
                        const btnStyle = buttonStyles[plan.color];
                        const dotStyle = dotStyles[plan.color];

                        return (
                            <Card
                                key={plan.id}
                                className={`relative p-8 rounded-3xl bg-white border-2 flex flex-col items-center text-center shadow-sm ${plan.recommended ? "border-slate-900 shadow-xl z-20" : "border-slate-200"
                                    }`}
                            >
                                {plan.recommended && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider z-20">
                                        Recommended
                                    </div>
                                )}

                                <div className="w-full mb-8">
                                    <div className={`mx-auto w-4 h-4 rounded-full mb-4 shadow-sm border border-black/5 ${dotStyle}`}></div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-1 leading-tight">{plan.name}</h3>
                                    <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest h-8 flex items-center justify-center">{plan.tagline}</p>
                                </div>

                                <div className="w-full mb-10 py-6 border-y border-slate-100 flex flex-col items-center">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-slate-900">{plan.pricing}</span>
                                        {plan.id !== "FREE_TRIAL" && <span className="text-slate-500 font-bold text-sm">ETB</span>}
                                    </div>
                                    <p className="text-slate-400 font-black text-[9px] uppercase tracking-widest mt-1">{plan.billingText}</p>
                                </div>

                                <div className="w-full space-y-8 mb-10 flex-grow">
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-center text-[11px] font-bold px-2 py-1.5 bg-slate-50 rounded-lg">
                                                <span className="text-slate-400 uppercase">Listings</span>
                                                <span className="text-slate-900 tracking-tight">{plan.limits.listings.split(' ')[0]}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[11px] font-bold px-2 py-1.5 bg-slate-50 rounded-lg">
                                                <span className="text-slate-400 uppercase">Staff</span>
                                                <span className="text-slate-900 tracking-tight">{plan.limits.staff}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[11px] font-bold px-2 py-1.5 bg-slate-50 rounded-lg">
                                                <span className="text-slate-400 uppercase">Images</span>
                                                <span className="text-slate-900 tracking-tight">{plan.limits.images}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <ul className="flex flex-col items-center space-y-3 px-2">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className={`flex items-start gap-2 text-left text-xs font-bold leading-tight ${feature.included ? "text-slate-700" : "text-slate-300 line-through"}`}>
                                                <span className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded-md flex items-center justify-center text-[8px] ${feature.included ? `${dotStyle} text-white` : "bg-slate-100 text-slate-300"}`}>
                                                    {feature.included ? "✓" : "×"}
                                                </span>
                                                <span>{feature.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Link href="/auth/register" className="w-full mt-auto">
                                    <Button
                                        className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-md hover:shadow-lg transition-shadow border-none ${btnStyle}`}
                                    >
                                        Select Plan
                                    </Button>
                                </Link>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
