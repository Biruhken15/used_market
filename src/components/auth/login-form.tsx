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

            // Hard redirect to un-guarded route for reliable session establishment in production
            const callbackUrl = searchParams.get("callbackUrl") || "/";
            window.location.href = callbackUrl;
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto relative px-2 py-10 md:py-20">
            <div className="p-6 md:p-10 bg-white border-2 border-slate-200 rounded-[2rem] shadow-sm">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 group/logo">
                        <div className="w-12 h-12 flex items-center justify-center">
                            <img src="/ethiopian-mascot.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col items-start -space-y-1">
                            <span className="font-black text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600 uppercase italic leading-none">KesewEj</span>
                            <span className="text-[11px] font-bold text-violet-600 uppercase tracking-widest italic ml-0.5">ከሰው እጅ</span>
                        </div>
                    </Link>

                    <h1 className="text-3xl font-black text-slate-950 tracking-tighter mb-2">Log In</h1>
                    <p className="text-violet-600 font-bold text-sm">Log into your account</p>
                    <p className="text-violet-600 font-black text-[10px] uppercase tracking-widest mt-4 p-2 bg-violet-50 rounded-lg inline-block border border-violet-100 italic">
                        "Pay a little, enjoy big commissions."
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold py-3 px-4 rounded-xl text-center flex items-center justify-center gap-2">
                            <ShieldCheck size={14} />
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-slate-700 ml-1">Email</label>
                            </div>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Mail size={16} />
                                </div>
                                <Input
                                    type="email"
                                    placeholder="your@identity.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 !rounded-xl border border-slate-200 bg-white focus:border-slate-950 outline-none transition-all pl-12 font-medium text-slate-900"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-slate-700 ml-1">Password</label>
                                <Link href="/" className="text-xs font-bold text-violet-600 hover:underline transition-colors">
                                    Recovery?
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Lock size={16} />
                                </div>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 !rounded-xl border border-slate-200 bg-white focus:border-slate-950 outline-none transition-all pl-12 font-medium text-slate-900"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold text-sm hover:from-violet-700 hover:to-pink-700 active:scale-[0.98] transition-all border-none relative overflow-hidden group/btn"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {isLoading ? "Logging in..." : "Log In"}
                        </span>
                    </Button>

                    <div className="text-center pt-6 border-t border-slate-100">
                        <p className="text-xs font-bold text-slate-500">
                            New to the ecosystem?{" "}
                            <Link href="/auth/register" className="text-violet-600 hover:underline transition-colors">
                                Create Profile
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
            
            <div className="mt-6 flex justify-center gap-6">
                <Link href="/about" className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors">Manifesto</Link>
                <Link href="/safety" className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors">Safety</Link>
                <Link href="/pricing" className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors">Pricing</Link>
            </div>
        </div>
    );
};
