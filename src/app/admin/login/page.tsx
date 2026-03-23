"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // If user was redirected here because session expired, show a message
    const sessionExpired = searchParams.get("expired") === "true";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (res?.error) {
            setError("Invalid credentials or your account does not have admin access.");
            return;
        }

        // Verify the user is actually an admin after login
        router.push("/admin");
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
            
            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-10">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-indigo-500/30 group-hover:bg-indigo-500 transition-colors">
                            UM
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-black text-xl tracking-tight leading-none">Used Market</span>
                            <span className="text-[9px] font-black uppercase text-indigo-400 tracking-[0.3em] mt-1">Admin Access</span>
                        </div>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl">
                    <div className="mb-8">
                        <h1 className="text-2xl font-black text-white tracking-tight mb-1">Secure Admin Login</h1>
                        <p className="text-slate-500 font-medium text-sm">Only authorized administrators may access this area.</p>
                    </div>

                    {/* Session expired banner */}
                    {sessionExpired && (
                        <div className="mb-6 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3">
                            <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            <p className="text-amber-400 text-xs font-bold">Your session has expired. Please sign in again.</p>
                        </div>
                    )}

                    {/* Error banner */}
                    {error && (
                        <div className="mb-6 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                            <p className="text-rose-400 text-xs font-bold">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white text-sm font-medium rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-600 transition-all"
                                placeholder="admin@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white text-sm font-medium rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-600 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-3.5 px-6 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 disabled:text-indigo-700 text-white font-bold rounded-xl transition-all text-sm tracking-wide shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-indigo-400 border-t-white rounded-full animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                "Sign in to Admin Panel"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-800 text-center">
                        <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-slate-400 transition-colors">
                            ← Return to Marketplace
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
