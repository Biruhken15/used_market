"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { inviteStaffAction, removeStaffAction } from '@/lib/actions/staff-actions';
import { useRouter } from 'next/navigation';
import {
    UserPlus,
    X,
    Mail,
    Link as LinkIcon,
    Copy,
    Check,
    Shield,
    Clock,
    Trash2,
    Users,
    ArrowRight
} from 'lucide-react';

interface StaffMember {
    _id?: string;
    userId?: string;
    email: string;
    role: string;
    addedAt?: string;
}

interface StaffListProps {
    storeId: string;
    staff: StaffMember[];
}

export function StaffList({ storeId, staff }: StaffListProps) {
    const router = useRouter();
    const [inviteEmail, setInviteEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await inviteStaffAction(storeId, inviteEmail);
            if (result.error) {
                setError(result.error);
            } else {
                setSuccess(`Invitation Protocol Initiated for ${inviteEmail}`);
                setInviteEmail("");
                router.refresh();
            }
        } catch (err: any) {
            setError("Failed to initialize invitation.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (identifier: string) => {
        if (!confirm("Confirm staff removal from protocol?")) return;

        setLoading(true);
        try {
            const result = await removeStaffAction(storeId, identifier);
            if (result.error) {
                setError(result.error);
            } else {
                setSuccess("Access Revoked Successfully.");
                router.refresh();
            }
        } catch (err: any) {
            setError("Failed to revoke access.");
        } finally {
            setLoading(false);
        }
    };

    const copyInviteLink = (email: string) => {
        const baseUrl = window.location.origin;
        const link = `${baseUrl}/auth/register?inviteEmail=${encodeURIComponent(email)}&storeId=${storeId}`;
        navigator.clipboard.writeText(link);
        setCopiedId(email);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-12">
            {/* Premium Invite Section */}
            <div className="bg-slate-900 rounded-[3rem] p-8 md:p-14 text-white relative overflow-hidden shadow-2xl border border-white/5">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg border border-white/10 mb-6 backdrop-blur-md">
                        <Users size={12} className="text-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Team Expansion</span>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tighter italic uppercase text-white font-serif">
                        Recruit <span className="text-blue-400">Managers.</span>
                    </h3>
                    <p className="text-slate-400 text-base font-medium mb-10 leading-relaxed max-w-lg">
                        Empower your team with full management permissions.
                        Invited users gain absolute access to store protocols.
                    </p>

                    <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1 group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                            <input
                                type="email"
                                required
                                placeholder="entry@protocol.io"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-sm font-bold placeholder:text-slate-600 focus:bg-white/10 focus:border-blue-500/50 outline-none transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="h-16 px-10 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 border-none group"
                        >
                            {loading ? "INITIALIZING..." : (
                                <>
                                    Send Invite
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {(error || success) && (
                        <div className={`mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest backdrop-blur-md border ${error ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                            <div className={`w-2 h-2 rounded-full ${error ? 'bg-rose-500' : 'bg-emerald-500'} animate-pulse`} />
                            {error || success}
                        </div>
                    )}
                </div>
            </div>

            {/* Staff Matrix List */}
            <div className="space-y-8">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-900 border border-slate-200">
                            <Shield size={14} />
                        </div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Authorized Personnel ({staff.length})</h4>
                    </div>
                    <div className="h-px bg-slate-100 flex-1 ml-10 hidden sm:block" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {staff.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <Users size={24} className="text-slate-200" />
                            </div>
                            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Isolated Protocol: No Staff Found</p>
                        </div>
                    ) : (
                        staff.map((member, idx) => {
                            const isPending = !member.userId;
                            return (
                                <div key={idx} className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-400/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500">
                                    <div className="flex items-center gap-5 min-w-0">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${isPending ? 'bg-amber-50 text-amber-500 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                            {isPending ? <Clock size={20} /> : <Shield size={20} />}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <p className="text-base font-black text-slate-900 truncate tracking-tight uppercase italic">{member.email}</p>
                                                {!isPending && <Check size={14} className="text-emerald-500 shrink-0" strokeWidth={4} />}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                                    Full Access
                                                </span>
                                                {isPending && (
                                                    <span className="px-2.5 py-1 bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-tighter rounded-lg border border-amber-200/50 flex items-center gap-1.5">
                                                        <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                                                        Awaiting Reg
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                        {isPending && (
                                            <button
                                                onClick={() => copyInviteLink(member.email)}
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${copiedId === member.email ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white'}`}
                                                title="Copy Invite Link"
                                            >
                                                {copiedId === member.email ? <Check size={16} strokeWidth={3} /> : <Copy size={16} />}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleRemove(member.userId || member.email)}
                                            className="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                            title="Revoke Access"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
