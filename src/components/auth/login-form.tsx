"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export const LoginForm = () => {
    const searchParams = useSearchParams();
    const initialEmail = searchParams.get("email") || "";
    const isInvited = searchParams.get("invited") === "true";

    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (initialEmail) setEmail(initialEmail);
    }, [initialEmail]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid credentials. Please check your email and password.");
                setIsLoading(false);
                return;
            }

            // Forced hard redirect for session reliability
            window.location.href = "/dashboard";
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full min-h-[90vh] flex items-center justify-center relative px-4 overflow-hidden py-10 md:py-20">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 -left-20 w-72 h-72 md:w-96 md:h-96 bg-violet-600/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-72 h-72 md:w-96 md:h-96 bg-pink-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

            <div className="w-full max-w-xl relative z-10 transition-all duration-700 animate-fade-in-up">
                {/* Platform Identity Card */}
                <div className="p-8 md:p-14 bg-white/80 backdrop-blur-2xl border-2 border-white/50 rounded-[3rem] shadow-2xl shadow-indigo-100/40">
                    <div className="text-center mb-12">
                        <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
                            <div className="w-14 h-14 flex items-center justify-center transition-transform group-hover:rotate-6 duration-500">
                                <img src="/ethiopian-mascot.png" alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col items-start -space-y-1">
                                <span className="font-black text-3xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-pink-600 uppercase italic leading-none">Used Market</span>
                                <span className="text-xs font-black text-violet-600 uppercase tracking-[0.3em] italic ml-1 opacity-70">ከሰው እጅ</span>
                            </div>
                        </Link>
                        
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 rounded-full text-[9px] font-black text-violet-600 uppercase tracking-widest mb-2 border border-violet-100">
                                <Sparkles size={10} /> Secure Node: 01
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter leading-none italic uppercase">Authorize <br /> Access</h1>
                            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-2">Enter your ecosystem credentials</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="bg-red-50 border-2 border-red-50 text-red-600 text-[10px] font-black uppercase tracking-[0.2em] py-4 px-6 rounded-2xl text-center flex items-center justify-center gap-3 animate-shake">
                                <ShieldCheck size={14} className="animate-pulse" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Identity</label>
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-600 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <Input
                                        type="email"
                                        placeholder="your@identity.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-16 !rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:border-violet-600 focus:bg-white focus:shadow-2xl focus:shadow-violet-100/20 transition-all pl-14 font-bold text-slate-950"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secret Keyword</label>
                                    <Link href="/" className="text-[10px] font-black text-violet-600 uppercase tracking-widest hover:text-pink-600 transition-colors">
                                        Recovery?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-600 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-16 !rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:border-violet-600 focus:bg-white focus:shadow-2xl focus:shadow-violet-100/20 transition-all pl-14 font-bold text-slate-950"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-16 rounded-2xl bg-slate-950 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-violet-600 active:scale-95 shadow-2xl shadow-indigo-100 transition-all border-none relative overflow-hidden group/btn"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Synchronizing...</span>
                                    </>
                                ) : (
                                    <>
                                        Authorize Access
                                        <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
                                    </>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-700" />
                        </Button>

                        <div className="text-center pt-8 border-t border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                New to the ecosystem?{" "}
                                <Link href="/auth/register" className="text-violet-600 font-black hover:text-pink-600 transition-colors underline-offset-4 decoration-2">
                                    Create Profile
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
                
                {/* Secondary Help Links */}
                <div className="mt-8 flex justify-center gap-8">
                    <Link href="/about" className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Manifesto</Link>
                    <Link href="/safety" className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Security Protocol</Link>
                    <Link href="/pricing" className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Ecosystem Plans</Link>
                </div>
            </div>
        </div>
    );
};
