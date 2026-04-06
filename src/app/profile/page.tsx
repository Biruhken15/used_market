"use client";

import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, LogOut, Shield, ShieldCheck, Mail, Fingerprint, Bell, Check, ArrowRight } from "lucide-react";
import { acceptInvitationAction } from "@/lib/actions/staff-actions";

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(session?.user?.name || "");
    const [invitations, setInvitations] = useState<any[]>([]);
    const [invitesLoading, setInvitesLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const fetchInvites = async () => {
            try {
                const res = await fetch('/api/user/invitations');
                const data = await res.json();
                setInvitations(data.invitations || []);
            } catch (err) {
                console.error("Failed to fetch protocol invitations.");
            } finally {
                setInvitesLoading(false);
            }
        };
        if (session) fetchInvites();
    }, [session]);

    if (!session) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] animate-pulse">Synchronizing Session...</p>
        </div>
    );

    const handleUpdateProfile = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const res = await fetch(`/api/user/${(session.user as any).id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            await update({ name }); // Update NextAuth session
            setMessage({ type: 'success', text: 'Identity protocol updated successfully.' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to update identity.' });
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptInvite = async (inviteId: string) => {
        setLoading(true);
        try {
            const result = await acceptInvitationAction(inviteId);
            if (result.error) throw new Error(result.error);
            
            setInvitations(prev => prev.filter(i => i._id !== inviteId));
            setMessage({ type: 'success', text: 'Access protocol accepted. Store access granted.' });
            
            // Short delay then redirect to the store
            const acceptedInvite = invitations.find(i => i._id === inviteId);
            if (acceptedInvite?.storeId?.storeSlug) {
                setTimeout(() => {
                    window.location.href = `/seller/mystore`;
                }, 1500);
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const initial = session.user.name ? session.user.name[0].toUpperCase() : "U";

    return (
        <div className="max-w-2xl mx-auto px-6 py-12 md:py-24">
            <div className="space-y-16">
                {/* Minimalist Header */}
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="relative group">
                        <div className="w-24 h-24 bg-white border-2 border-slate-900 rounded-full flex items-center justify-center text-3xl font-black shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all duration-200">
                            {initial}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white shadow-lg">
                            <ShieldCheck size={14} strokeWidth={3} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Settings Protocol</h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">User ID: {(session.user as any).id?.slice(-8)}</p>
                    </div>
                </div>

                {/* Invitations Section (If any) */}
                {invitations.length > 0 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex items-center gap-2 mb-2">
                            <Bell size={12} className="text-blue-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Pending System Invitations</span>
                        </div>
                        {invitations.map((invite) => (
                            <div key={invite._id} className="bg-blue-50/50 border border-blue-100 p-6 rounded-3xl flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl border border-blue-100 flex items-center justify-center text-xl shadow-sm">
                                        🏪
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-tight text-slate-900 italic">
                                            {invite.storeId?.storeName || "Unknown Store"}
                                        </p>
                                        <p className="text-[10px] font-bold text-blue-600/60 uppercase tracking-widest">
                                            Invited by {invite.invitedBy?.name || "Admin"}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => handleAcceptInvite(invite._id)}
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-6 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-200 border-none"
                                >
                                    Accept Protocol
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Identity Form */}
                <div className="space-y-8 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                                <User size={12} className="text-slate-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Display Identity</span>
                            </div>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-14 rounded-2xl border-slate-200 bg-white px-6 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                                placeholder="Full Name"
                            />
                        </div>

                        <div className="space-y-2 opacity-60">
                            <div className="flex items-center gap-2 mb-2">
                                <Mail size={12} className="text-slate-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Core Address (Locked)</span>
                            </div>
                            <div className="h-14 rounded-2xl border border-slate-200 bg-slate-100/50 px-6 flex items-center font-mono font-bold text-slate-400 text-xs truncate">
                                {session.user.email}
                            </div>
                        </div>
                    </div>

                    <Button
                        disabled={loading || name === session.user.name}
                        onClick={handleUpdateProfile}
                        className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                    >
                        {loading ? "SYNCHRONIZING..." : "Save Changes"}
                    </Button>
                </div>

                {/* Account Actions */}
                <div className="space-y-4">
                    <button 
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl hover:border-red-200 hover:bg-red-50/30 transition-all group shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <LogOut size={20} strokeWidth={2.5} />
                            </div>
                            <div className="text-left">
                                <p className="font-black text-slate-900 text-sm italic uppercase">Sign Out</p>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Terminate Current Session</p>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-red-500 group-hover:border-red-200 transition-all">
                            <ArrowRight size={14} />
                        </div>
                    </button>
                </div>

                {message && (
                    <div className={`p-5 rounded-2xl border font-black text-[11px] uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
}
