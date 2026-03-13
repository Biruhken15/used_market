"use client";

export const AboutSection = () => {
    return (
        <section id="about" className="w-full py-32 px-6 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-lg mb-6 border border-accent/20">
                            <span className="text-[10px] font-black uppercase tracking-widest text-accent">Our Mission</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-8">
                            Modernizing Used <br />
                            <span className="text-accent">Marketplace</span> in Ethiopia.
                        </h2>
                        <p className="text-slate-600 font-medium text-lg leading-relaxed mb-10 max-w-xl">
                            We believe that high-quality products deserve a second life. Used Market provides a secure, professional, and efficient bridge between quality sellers and smart buyers.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-xl">🛡️</div>
                                <h4 className="font-bold text-slate-900">Verified Sellers</h4>
                                <p className="text-sm text-slate-500">We verify every seller profile to maintain a high standard of trust and professional trading.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-xl">⚡</div>
                                <h4 className="font-bold text-slate-900">Swift Listing</h4>
                                <p className="text-sm text-slate-500">Post your products in seconds with our optimized mobile-first listing flow.</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 bg-accent/5 rounded-[3rem] -rotate-3"></div>
                        <div className="relative premium-card p-1 bg-white aspect-square overflow-hidden">
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent"></div>
                                <div className="z-10 text-center p-12">
                                    <div className="text-6xl mb-6">🏪</div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-2">Grow Your Business</h3>
                                    <p className="text-slate-500 font-medium">Professional store tools for serious sellers across the nation.</p>
                                </div>
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200"></div>
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400">+5k Sellers</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
