"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    if (!session) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-slate-500 font-bold uppercase tracking-widest animate-pulse">Initializing Session...</p>
        </div>
    );

    const initial = session.user.name ? session.user.name[0].toUpperCase() : "U";

    return (
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-20">
            <div className="space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 pb-8 md:pb-12 border-b border-slate-100">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-900 text-white rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center text-3xl md:text-4xl font-black shadow-2xl shadow-slate-200 border-4 border-white">
                        {initial}
                    </div>
                    <div className="text-center md:text-left space-y-2">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter italic uppercase">System Profile</h1>
                        <p className="text-slate-500 font-bold text-sm md:text-lg">Manage your identity across the ecosystem.</p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                            Status: Online & Synchronized
                        </div>
                    </div>
                </div>

                {/* Form Sections */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Personal Data</h3>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">Your public identifier and communication address.</p>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Full Name</label>
                                <Input
                                    defaultValue={session.user.name || ""}
                                    className="h-12 rounded-xl border-slate-200 bg-slate-50/50 px-4 font-semibold text-slate-900 focus:bg-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address</label>
                                <Input
                                    defaultValue={session.user.email || ""}
                                    disabled
                                    className="h-12 rounded-xl border-slate-100 bg-slate-100 px-4 font-mono font-bold text-slate-400 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                className="bg-slate-900 text-white font-black uppercase text-xs tracking-widest px-8 rounded-xl h-12 shadow-xl shadow-slate-200 hover:scale-105 transition-transform"
                                onClick={() => setMessage({ type: 'success', text: 'Profile synchronization logic will be implemented in the next phase.' })}
                            >
                                Update Profile
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8">
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Security</h3>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">Manage your authentication protocol and credentials.</p>
                    </div>

                    <div className="md:col-span-2 space-y-4">
                        <button className="w-full flex items-center justify-between p-6 bg-slate-50/50 border border-slate-200 rounded-2xl hover:border-slate-900 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-slate-900 border border-slate-100 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                </div>
                                <div className="text-left">
                                    <p className="font-black text-slate-900 text-sm">Update Password</p>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Enhanced Encryption Protocol</p>
                                </div>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 group-hover:text-slate-900"><path d="m9 18 6-6-6-6" /></svg>
                        </button>
                    </div>
                </div>

                {message && (
                    <div className={`p-4 rounded-xl border font-bold text-sm text-center ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
}
