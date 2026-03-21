"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { StoreForm } from "@/components/store/store-form";
import { CheckCircle2, Rocket, ShieldCheck, TrendingUp } from "lucide-react";

export default function CreateStorePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!session) return null;

    const benefits = [
        { icon: <Rocket className="w-5 h-5 text-rose-500" />, title: "SAAS Marketplace", desc: "A professional SaaS infrastructure for high-velocity used product trading." },
        { icon: <TrendingUp className="w-5 h-5 text-rose-500" />, title: "Sell Anything", desc: "List and manage your used inventory with advanced merchant tools." },
        { icon: <ShieldCheck className="w-5 h-5 text-rose-500" />, title: "Buy with Trust", desc: "Secure environment for buyers to find quality pre-owned goods." },
        { icon: <CheckCircle2 className="w-5 h-5 text-rose-500" />, title: "Real-time Protocol", desc: "Instant matching of buyer demand with seller supply across Ethiopia." }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-40 pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                    {/* Sidebar - 25% */}
                    <aside className="lg:w-[30%] space-y-10 lg:sticky lg:top-44 h-fit">
                        <div className="space-y-4">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-rose-200">
                                ETHIO MARKETPLACE
                            </span>
                            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
                                Used Product <br />
                                <span className="text-rose-600">SAAS Platform</span>
                            </h1>
                            <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-sm">
                                The professional standard for buying and selling quality used products. Our SaaS infrastructure empowers sellers to scale and buyers to find value.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {benefits.map((b, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="shrink-0 w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-rose-50 transition-all">
                                        {b.icon}
                                    </div>
                                    <div className="space-y-0.5">
                                        <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight">{b.title}</h3>
                                        <p className="text-slate-400 font-bold text-[11px] leading-tight">{b.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 rounded-[2rem] bg-slate-900 text-white space-y-3 shadow-2xl">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Need Assistance?</p>
                            <p className="text-xs font-bold text-slate-200">Our dedicated support team is ready to help you set up your professional profile.</p>
                            <button className="text-xs font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 transition-colors">Contact Support →</button>
                        </div>
                    </aside>

                    {/* Main Form - 75% equivalent (filling remaining space) */}
                    <main className="flex-1">
                        <div className="bg-white rounded-[2.5rem] p-6 lg:p-12 shadow-sm border border-slate-100 transition-all hover:shadow-xl hover:border-slate-200/50">
                            <StoreForm />
                        </div>

                        <div className="mt-8 flex justify-center lg:justify-start">
                            <button
                                onClick={() => router.back()}
                                className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-rose-600 transition-colors group"
                            >
                                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                                Exit Protocol
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
