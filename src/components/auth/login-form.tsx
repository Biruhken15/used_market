"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";

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

            router.replace("/dashboard");
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto relative">
            <div className="p-10 bg-white border-2 border-slate-200 rounded-[2rem] shadow-sm">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-12 h-12 flex items-center justify-center">
                            <img src="/ethiopian-mascot.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col items-start -space-y-1">
                            <span className="font-black text-2xl tracking-tighter text-slate-950 uppercase italic leading-none">Used Market</span>
                            <span className="text-[11px] font-bold text-accent uppercase tracking-widest italic ml-0.5">ከሰው እጅ</span>
                        </div>
                    </Link>
                    <h1 className="text-3xl font-black text-slate-950 tracking-tighter mb-2">Login</h1>
                    <p className="text-slate-500 font-bold text-sm">Enter your account details</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-rose-50 border-2 border-rose-100 text-rose-600 text-[11px] font-black uppercase tracking-widest py-4 px-4 rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Email Address</label>
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 !rounded-lg border-slate-200 focus:border-slate-950 transition-all bg-white"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-slate-700">Password</label>
                                <Link href="/" className="text-xs text-blue-600 hover:underline">
                                    Forgot?
                                </Link>
                            </div>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-12 !rounded-lg border-slate-200 focus:border-slate-950 transition-all bg-white"
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        disabled={isLoading}
                        className="h-14 rounded-lg bg-slate-950 text-white font-bold text-base hover:bg-slate-800 transition-all mt-4"
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </Button>

                    <div className="text-center pt-4">
                        <p className="text-sm text-slate-500">
                            Don't have an account?{" "}
                            <Link href="/auth/register" className="text-slate-950 font-bold hover:underline">
                                Signup
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
