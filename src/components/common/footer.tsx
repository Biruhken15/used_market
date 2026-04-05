"use client";

import Link from "next/link";

export const Footer = () => {
    return (
        <footer className="w-full bg-slate-900 pt-20 pb-10 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 flex items-center justify-center">
                                <img src="/ethiopian-mascot.png" alt="KesewEj Logo" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col -space-y-1">
                                <span className="text-xl font-black text-white tracking-tighter">KesewEj</span>
                                <span className="text-[11px] font-bold text-accent uppercase tracking-widest leading-none ml-0.5 italic">ከሰው እጅ</span>
                            </div>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            The most trusted platform for buying and selling quality used products across Ethiopia. Secure, fast, and professional.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Marketplace</h4>
                        <ul className="space-y-4 text-sm font-medium text-slate-400">
                            <li><Link href="/products" className="hover:text-accent transition-colors">Find Products</Link></li>
                            <li><Link href="/brokers" className="hover:text-accent transition-colors">Browse Stores</Link></li>
                            <li><Link href="/pricing" className="hover:text-accent transition-colors">Pricing Plans</Link></li>
                            <li><Link href="/auth/register" className="hover:text-accent transition-colors">Open a Store</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Support</h4>
                        <ul className="space-y-4 text-sm font-medium text-slate-400">
                            <li><Link href="/help" className="hover:text-accent transition-colors">Help Center</Link></li>
                            <li><Link href="/safety" className="hover:text-accent transition-colors">Safety Tips</Link></li>
                            <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
                            <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Social/Stats */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Connect</h4>
                        <div className="flex gap-4 mb-8">
                            {['Telegram', 'LinkedIn', 'Facebook'].map((social) => (
                                <div key={social} className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 cursor-pointer transition-all">
                                    <span className="text-[10px] font-bold">{social[0]}</span>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Status</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-white text-xs font-bold">Systems Operational</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-xs font-medium">
                        © {new Date().getFullYear()} KesewEj. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-slate-500 text-xs font-medium">
                        <span className="flex items-center gap-1">
                            Made with 🇪🇹 in Addis
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
