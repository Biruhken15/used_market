"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";

export const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

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

            router.replace("/dashboard");
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto relative group">
            {/* Decorative Background Elements */}
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-all"></div>
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl group-hover:bg-blue-400/20 transition-all"></div>

            <div className="premium-card p-10 bg-white/80 backdrop-blur-xl border border-white relative z-10 shadow-2xl shadow-slate-200/50">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 group/logo">
                        <div className="w-10 h-10 bg-accent text-white rounded-xl flex items-center justify-center text-xl font-black shadow-lg shadow-accent/20 group-hover/logo:scale-105 transition-transform">
                            U
                        </div>
                        <span className="font-black text-2xl tracking-tighter text-slate-900">Used Market</span>
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Welcome Back.</h1>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">kesew ej • ክስው እጅ</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-rose-50 border border-rose-100 text-rose-600 text-[11px] font-black uppercase tracking-widest py-4 px-4 rounded-xl text-center flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <Input
                            label="Store Email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-14 !rounded-2xl border-slate-100 focus:border-accent transition-all"
                            required
                        />

                        <div className="relative">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-14 !rounded-2xl border-slate-100 focus:border-accent transition-all"
                                required
                            />
                            <div className="flex justify-end mt-2">
                                <Link href="/" className="text-[10px] font-black text-accent uppercase tracking-widest hover:text-slate-900 transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        disabled={isLoading}
                        className="!h-14 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-widest hover:bg-accent hover:shadow-xl hover:shadow-accent/20 border-none transition-all mt-4"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                Processing...
                            </div>
                        ) : "Step into Market"}
                    </Button>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-50"></div></div>
                        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-white px-4 text-slate-300">New around here?</span></div>
                    </div>

                    <Link href="/auth/register" className="block">
                        <Button
                            variant="outline"
                            fullWidth
                            className="!h-14 rounded-2xl border-2 border-slate-100 text-slate-600 font-black text-sm uppercase tracking-widest hover:bg-slate-50 hover:border-slate-200 transition-all"
                        >
                            Create Store Account
                        </Button>
                    </Link>
                </form>
            </div>
        </div>
    );
};
