"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";

export const RegisterForm = () => {
    const searchParams = useSearchParams();
    const inviteEmail = searchParams.get("inviteEmail");
    const storeId = searchParams.get("storeId");

    const [name, setName] = useState("");
    const [email, setEmail] = useState(inviteEmail || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (inviteEmail) setEmail(inviteEmail);
    }, [inviteEmail]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!name || !email || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        if (password.length < 4) {
            setError("Password must be at least 4 characters long.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.ok) {
                // Auto sign-in after registration — no need to visit the login page
                const signInRes = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                });
                if (signInRes?.ok) {
                    // Redirect to marketplace (not a middleware-guarded route)
                    window.location.href = "/";
                    return;
                }
                // Fallback: go to login if auto sign-in fails
                router.push(`/auth/login?email=${encodeURIComponent(email)}`);
            } else {
                const data = await res.json();
                setError(data.message || "Registration failed.");
                setIsLoading(false);
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto relative px-2 py-10 md:py-20">
            <div className="p-6 md:p-10 bg-white border-2 border-slate-200 rounded-[2rem] shadow-sm">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 group/logo">
                        <div className="w-12 h-12 flex items-center justify-center">
                            <img src="/ethiopian-mascot.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col items-start -space-y-1">
                            <span className="font-black text-2xl tracking-tighter text-slate-950 uppercase italic leading-none">KesewEj</span>
                            <span className="text-[11px] font-bold text-violet-600 uppercase tracking-widest italic ml-0.5">ከሰው እጅ</span>
                        </div>
                    </Link>

                    <h1 className="text-3xl font-black text-slate-950 tracking-tighter mb-2">Create Account</h1>
                    <p className="text-slate-500 font-bold text-sm">Join the platform today</p>
                    <p className="text-emerald-600 font-black text-[10px] uppercase tracking-widest mt-4 p-2 bg-emerald-50 rounded-lg inline-block border border-emerald-100 italic">
                        "Your portal to professional trade."
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 text-[11px] font-black uppercase tracking-widest py-4 px-4 rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 ml-1">Full Name</label>
                            <Input
                                type="text"
                                placeholder="Abebe Balcha"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-12 !rounded-xl border-slate-200 focus:border-slate-950 transition-all bg-white font-medium text-slate-900"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 ml-1">Email</label>
                            <Input
                                type="email"
                                placeholder="abebe@market.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 !rounded-xl border-slate-200 focus:border-slate-950 transition-all bg-white font-medium text-slate-900"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 ml-1">Password</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 !rounded-xl border-slate-200 focus:border-slate-950 transition-all bg-white font-medium text-slate-900"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 ml-1">Confirm Password</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="h-12 !rounded-xl border-slate-200 focus:border-slate-950 transition-all bg-white font-medium text-slate-900"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="h-14 w-full rounded-xl bg-slate-950 text-white font-black text-xs uppercase tracking-widest hover:bg-violet-600 shadow-xl shadow-slate-100 transition-all border-none"
                        >
                            {isLoading ? "Registering..." : "Register"}
                        </Button>
                    </div>

                    <div className="text-center pt-6 border-t border-slate-100">
                        <p className="text-xs font-bold text-slate-500">
                            Already synchronized?{" "}
                            <Link href="/auth/login" className="text-violet-600 font-bold hover:underline transition-colors">
                                Log In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
