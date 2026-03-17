"use client";

import { useState, useEffect } from "react";
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
                // If it was an invite, we might want to go straight to login or dashboard
                // For better UX during invitation: push to login but with a hint, 
                // or just to dashboard if redirect works.
                // Redirecting to login is safer for next-auth session establishment.
                router.push(`/auth/login?email=${encodeURIComponent(email)}&invited=true`);
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
        <div className="w-full max-w-lg mx-auto relative">
            <div className="p-10 bg-white border-2 border-slate-200 rounded-[2rem] shadow-sm">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 group/logo">
                        <div className="w-12 h-12 flex items-center justify-center">
                            <img src="/ethiopian-mascot.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col items-start -space-y-1">
                            <span className="font-black text-2xl tracking-tighter text-slate-950 uppercase italic leading-none">Used Market</span>
                            <span className="text-[11px] font-bold text-accent uppercase tracking-widest italic ml-0.5">ከሰው እጅ</span>
                        </div>
                    </Link>

                    <h1 className="text-3xl font-black text-slate-950 tracking-tighter mb-2">Create Account</h1>
                    <p className="text-slate-500 font-bold text-sm">Join our marketplace today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-rose-50 border-2 border-rose-100 text-rose-600 text-[11px] font-black uppercase tracking-widest py-4 px-4 rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Full Name</label>
                            <Input
                                type="text"
                                placeholder="Abebe Balcha"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-12 !rounded-lg border-slate-200 focus:border-slate-950 transition-all bg-white"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Email Address</label>
                            <Input
                                type="email"
                                placeholder="abebe@market.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 !rounded-lg border-slate-200 focus:border-slate-950 transition-all bg-white"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-12 !rounded-lg border-slate-200 focus:border-slate-950 transition-all bg-white"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Confirm Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="h-12 !rounded-lg border-slate-200 focus:border-slate-950 transition-all bg-white"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            fullWidth
                            disabled={isLoading}
                            className="h-14 rounded-lg bg-slate-950 text-white font-bold text-base hover:bg-slate-800 transition-all"
                        >
                            {isLoading ? "Creating Account..." : "Register"}
                        </Button>
                    </div>

                    <div className="text-center pt-2">
                        <p className="text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="text-slate-950 font-bold hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
