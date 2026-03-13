import React from 'react';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[200] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center p-10 animate-in fade-in duration-500">
            <div className="relative">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />

                {/* Spinner */}
                <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin shadow-xl relative z-10" />
            </div>

            <div className="mt-8 space-y-2 text-center relative z-10">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] animate-pulse">
                    Synchronizing...
                </h2>
                <div className="flex items-center justify-center gap-1">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                        />
                    ))}
                </div>
            </div>

            <div className="fixed bottom-10 left-1/2 -translate-x-1/2">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    Afridesign Used Store Marketplace
                </p>
            </div>
        </div>
    );
}
