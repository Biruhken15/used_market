import { Navbar } from "@/components/common/navbar";
import { MessageSquare,Bell, ShieldCheck, Zap, Users, Globe, BarChart3, Heart } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            
            {/* HERO SECTION */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-violet-50/50 to-transparent rounded-full blur-3xl -z-10" />
                
                <div className="max-w-6xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-[10px] font-black uppercase tracking-[0.2em] animate-fade-in">
                        <SparkleIcon /> The Paradigm Shift is Here
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9] md:leading-[0.85]">
                        Beyond a Marketplace. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600 italic">This is SaaS.</span>
                    </h1>
                    
                    <p className="max-w-2xl mx-auto text-lg md:text-xl font-bold text-slate-500 leading-relaxed">
                        Used Market (ከሰው እጅ) isn't just a classifieds site. We’ve built a powerful <span className="text-slate-900 underline decoration-violet-500 decoration-3 underline-offset-4">Software-as-a-Service</span> ecosystem designed to transform how used goods are traded in Ethiopia.
                    </p>
                </div>
            </section>

            {/* CORE VALUE PROPOSITION */}
            <section className="py-24 bg-slate-950 text-white relative">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none italic">
                                    A Modern Paradigm for <br /> Modern Entrepreneurs.
                                </h2>
                                <p className="text-slate-400 font-bold text-lg leading-relaxed">
                                    Forget the chaotic, fragmented trading of the past. Our platform provides a centralized, high-performance toolkit that empowers sellers to scale like professional enterprises.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="font-black uppercase tracking-widest text-xs text-white">For Single Sellers</h4>
                                    <p className="text-[11px] font-bold text-slate-500 uppercase leading-relaxed tracking-wide">Start your business from home with enterprise-grade tools, from inventory management to instant customer chat.</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="w-12 h-12 rounded-2xl bg-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
                                        <Globe className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="font-black uppercase tracking-widest text-xs text-white">For Professional Brokers</h4>
                                    <p className="text-[11px] font-bold text-slate-500 uppercase leading-relaxed tracking-wide">Manage massive portfolios, separate your personal life from business, and close deals faster with our advanced agent toolkit.</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-violet-600/20 to-pink-600/20 rounded-[4rem] border border-white/10 overflow-hidden flex items-center justify-center p-12">
                                <div className="text-center space-y-6">
                                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-violet-500/10">
                                        <SparkleIcon />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black italic tracking-tighter">Verified & Scalable.</h3>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                                            Building the most trusted <br /> used market ecosystem <br /> in Ethiopia.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-violet-600 rounded-full blur-[80px] opacity-50" />
                        </div>
                    </div>
                </div>
            </section>

            {/* TECHNOLOGY & FEATURES */}
            <section className="py-32 px-6">
                <div className="max-w-6xl mx-auto space-y-20">
                    <div className="text-center space-y-4">
                        <h3 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">The Engine Beneath</h3>
                        <div className="w-24 h-1 bg-gradient-to-r from-violet-600 to-pink-600 mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <FeatureCard 
                            icon={<MessageSquare className="w-8 h-8 text-violet-600" />}
                            title="Real-Time Negotiation"
                            description="Powered by Pusher, our instant messaging system ensures you never miss a beat. Negotiate and close deals in milliseconds with zero lag."
                        />
                        <FeatureCard 
                            icon={<Bell className="w-8 h-8 text-pink-500" />}
                            title="Smart Notifications"
                            description="Stay informed with a centralized notification engine. Price drops, new messages, and platform alerts—delivered instantly to your dashboard."
                        />
                        <FeatureCard 
                            icon={<ShieldCheck className="w-8 h-8 text-indigo-600" />}
                            title="Verified Trust Layer"
                            description="Our platform implements strict verification protocols for stores and brokers, creating a protected environment where both sides can trade with confidence."
                        />
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="pb-32 px-6">
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-12 md:p-20 text-center space-y-10 relative overflow-hidden shadow-2xl shadow-indigo-100">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600 rounded-full blur-[120px] opacity-20 -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-600 rounded-full blur-[120px] opacity-20 -ml-32 -mb-32" />
                    
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none italic">
                            Join the Used Goods Revolution.
                        </h2>
                        <p className="text-slate-400 font-bold max-w-xl mx-auto">
                            Experience the paradigm shift. Whether you are a buyer looking for value or a seller looking to scale, Used Market is your partner in progress.
                        </p>
                        <div className="pt-6">
                            <a href="/auth/register" className="inline-flex h-16 items-center px-10 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-violet-500/20">
                                Start Your Store Today
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-12 border-t border-slate-100 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
                    © {new Date().getFullYear()} ከሰው እጅ . USED MARKET SAAS ECOSYSTEM
                </p>
            </footer>
        </main>
    );
}

function StatCard({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
            <div className="text-3xl font-black text-white tracking-tight mb-1 italic">{value}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</div>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="space-y-6 group">
            <div className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center transition-all group-hover:bg-slate-900 group-hover:text-white group-hover:scale-110 group-hover:-rotate-6 duration-500">
                {icon}
            </div>
            <div className="space-y-3">
                <h4 className="text-xl font-black tracking-tight text-slate-900 italic uppercase">{title}</h4>
                <p className="text-[13px] font-bold text-slate-500 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

function SparkleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
    );
}
