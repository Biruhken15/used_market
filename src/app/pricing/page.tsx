"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import PricingSection from "@/components/pricing-section";

export default function PricingPage() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-10 text-slate-900">
            <PricingSection />

            <div className="mt-20 text-center bg-slate-50 rounded-[3rem] p-12 md:p-20 border border-slate-100">
                <h2 className="text-4xl font-black tracking-tighter mb-4">Questions about our plans?</h2>
                <p className="text-lg text-slate-500 mb-10 font-medium">We're here to help you find the best solution for your trading needs.</p>
                <Link href="/contact">
                    <Button variant="outline" className="px-12 py-4 rounded-2xl font-black text-lg border-2">Get in Touch</Button>
                </Link>
            </div>
        </div>
    );
}
