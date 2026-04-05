import React from 'react';
import { Navbar } from "@/components/common/navbar";
import { Sparkles, Users, ShieldCheck, Zap, Globe, MessageSquare, BarChart3, Heart } from 'lucide-react';

export const metadata = {
    title: 'About Us | ከሰው እጅ Marketplace',
    description: 'Learn about our mission to build the most trusted SaaS used market ecosystem in Ethiopia.',
};

const valueProps = [
    {
        title: "The SaaS Paradigm",
        description: "We aren't just a classifieds site. We provide enterprise-grade tools for inventory, chat, and scaling your business.",
        icon: <Zap className="w-8 h-8 text-violet-600" />
    },
    {
        title: "Expert Agent Network",
        description: "Formerly known as brokers, our Expert Agents manage massive portfolios with professional toolkits.",
        icon: <Users className="w-8 h-8 text-pink-500" />
    },
    {
        title: "Real-Time Trading",
        description: "Negotiate and close deals instantly with our Pusher-powered chat system. Zero lag, 100% engagement.",
        icon: <MessageSquare className="w-8 h-8 text-blue-500" />
    },
    {
        title: "Verified Trust Layer",
        description: "Every store and agent is verified to ensure a safe, protected environment for both buyers and sellers.",
        icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />
    },
    {
        title: "Ethiopian Scale",
        description: "Designed specifically for the Ethiopian market, connecting sellers across every city and region.",
        icon: <Globe className="w-8 h-8 text-amber-500" />
    },
    {
        title: "Growth Driven",
        description: "Our platform evolves with you. From your first sale to managing a 10-person staff, we provide the analytics to win.",
        icon: <BarChart3 className="w-8 h-8 text-indigo-500" />
    }
];

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            <Navbar />
            
            <div className="pt-32 pb-16 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header Section (Safety Center Style) */}
                    <div className="flex flex-col items-center text-center mb-16">
                        <div className="p-4 bg-violet-100 rounded-full mb-6 ring-8 ring-violet-50">
                            <Sparkles className="w-12 h-12 text-violet-600" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter uppercase italic">
                            Beyond a Marketplace.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600 leading-tight">Pay a little, enjoy big commissions.</span>
                        </h1>
                        <p className="max-w-2xl text-lg md:text-xl font-bold text-slate-500 leading-relaxed mb-6">
                            The ultimate ecosystem designed explicitly for expert sellers.
                        </p>
                    </div>

                    {/* Main Benefits Grid (Safety Center Style) */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {valueProps.map((prop, index) => (
                            <div key={index} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 group border-2 hover:border-violet-600/20">
                                <div className="mb-6 group-hover:scale-110 transition-transform duration-500">{prop.icon}</div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase mb-3">{prop.title}</h3>
                                <p className="text-slate-500 font-bold text-sm leading-relaxed">{prop.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTA Section (Safety Center Style) */}
                    <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600 rounded-full blur-[120px] opacity-20 -mr-32 -mt-32" />
                        <div className="relative z-10 flex-1 space-y-4">
                            <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase">Join the Revolution</h2>
                            <p className="text-lg md:text-xl opacity-60 font-bold leading-relaxed">Whether you are a buyer looking for value or a seller looking to scale, Used Market is your partner in progress.</p>
                        </div>
                        <div className="relative z-10">
                            <a href="/auth/register" className="inline-block bg-gradient-to-r from-violet-600 to-pink-600 text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-violet-500/20">
                                Start Your Store
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="py-12 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
                    © {new Date().getFullYear()} ከሰው እጅ . USED MARKET SAAS ECOSYSTEM
                </p>
            </footer>
        </main>
    );
}
