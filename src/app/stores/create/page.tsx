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
            <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-6">
                <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-slate-900 tracking-tighter italic">ከሰው እጅ</span>
                    <span className="text-[10px] font-bold text-violet-600 uppercase tracking-[0.3em] mt-1">Authenticating Protocol</span>
                </div>
            </div>
        );
    }

    if (!session) return null;

    const benefits = [
        { icon: <Rocket className="w-5 h-5 text-violet-500" />, title: "SAAS Marketplace", desc: "A professional SaaS infrastructure for high-velocity used product trading." },
        { icon: <TrendingUp className="w-5 h-5 text-violet-500" />, title: "Sell Anything", desc: "List and manage your used inventory with advanced merchant tools." },
        { icon: <ShieldCheck className="w-5 h-5 text-violet-500" />, title: "Buy with Trust", desc: "Secure environment for buyers to find quality pre-owned goods." },
        { icon: <CheckCircle2 className="w-5 h-5 text-violet-500" />, title: "Real-time Protocol", desc: "Instant matching of buyer demand with seller supply across Ethiopia." }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-40 pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                    {/* Sidebar - 25% */}
                    <aside className="lg:w-[30%] space-y-10 lg:sticky lg:top-44 h-fit">
                        <div className="space-y-4">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-100">
                                ETHIO MARKETPLACE
                            </span>
                            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
                                Used Product <br />
                                <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">SAAS Platform</span>
                            </h1>
                            <div className="bg-violet-100/50 border border-violet-200 p-4 rounded-xl inline-block mt-2">
                                <p className="text-violet-700 font-black text-[11px] uppercase tracking-widest italic leading-relaxed max-w-sm">
                                    "Pay a little, enjoy big commissions."
                                </p>
                            </div>
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
                            <button className="text-xs font-black uppercase tracking-widest text-violet-500 hover:text-pink-500 transition-colors">Contact Support →</button>
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
                                className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-violet-600 transition-colors group"
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
