"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function PricingPage() {
    const plans = [
        {
            name: "Free",
            price: "$0",
            description: "Perfect for casual sellers",
            features: [
                "Up to 5 active listings",
                "Basic analytics",
                "Community support",
                "Standard visibility"
            ],
            buttonText: "Get Started",
            variant: "outline" as const
        },
        {
            name: "Pro",
            price: "$19",
            period: "/mo",
            description: "For serious traders",
            features: [
                "Unlimited active listings",
                "Advanced analytics",
                "Priority support",
                "Featured listing slots",
                "Custom store URL"
            ],
            buttonText: "Go Pro",
            variant: "primary" as const,
            featured: true
        },
        {
            name: "Business",
            price: "$49",
            period: "/mo",
            description: "For established stores",
            features: [
                "Everything in Pro",
                "Bulk upload tools",
                "Dedicated account manager",
                "Promotional credit",
                "API access"
            ],
            buttonText: "Contact Sales",
            variant: "outline" as const
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-20 text-slate-900">
            <div className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 text-slate-900">
                    Simple, Transparent <span className="text-blue-600">Pricing</span>
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium lead-relaxed">
                    Choose the plan that's right for your business. Grow from a side hustle to a full-time store with Ethio Market.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <Card
                        key={plan.name}
                        className={`relative p-10 rounded-[2.5rem] border transition-all duration-300 flex flex-col ${plan.featured
                                ? "border-blue-200 shadow-2xl shadow-blue-100 scale-105 z-10"
                                : "border-slate-100 shadow-sm hover:border-slate-200"
                            }`}
                    >
                        {plan.featured && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-black uppercase tracking-widest">
                                Most Popular
                            </div>
                        )}
                        <div className="mb-8">
                            <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-black">{plan.price}</span>
                                {plan.period && <span className="text-slate-400 font-bold">{plan.period}</span>}
                            </div>
                            <p className="text-slate-500 font-medium mt-4">{plan.description}</p>
                        </div>

                        <ul className="space-y-4 mb-10 flex-grow">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3 font-bold text-slate-600">
                                    <span className="text-blue-600 text-xl font-black">✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Link href="/auth/register" className="w-full">
                            <Button
                                fullWidth
                                variant={plan.variant}
                                className={`py-4 rounded-2xl font-black text-lg ${plan.featured ? "shadow-xl shadow-blue-100" : ""}`}
                            >
                                {plan.buttonText}
                            </Button>
                        </Link>
                    </Card>
                ))}
            </div>

            <div className="mt-20 text-center bg-slate-50 rounded-[3rem] p-12 md:p-20 border border-slate-100">
                <h2 className="text-4xl font-black tracking-tighter mb-4">Questions about our plans?</h2>
                <p className="text-lg text-slate-500 mb-10 font-medium">We're here to help you find the best solution for your trading needs.</p>
                <Link href="/auth/register">
                    <Button variant="outline" className="px-12 py-4 rounded-2xl font-black text-lg border-2">Get in Touch</Button>
                </Link>
            </div>
        </div>
    );
}
