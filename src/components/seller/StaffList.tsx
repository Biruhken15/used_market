"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { inviteStaffAction, removeStaffAction } from '@/lib/actions/staff-actions';
import { useRouter } from 'next/navigation';

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
                setSuccess(`Invitation sent to ${inviteEmail}`);
                setInviteEmail("");
                router.refresh();
            }
        } catch (err: any) {
            setError("Failed to send invitation.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (identifier: string) => {
        if (!confirm("Are you sure you want to remove this staff member?")) return;

        setLoading(true);
        try {
            const result = await removeStaffAction(storeId, identifier);
            if (result.error) {
                setError(result.error);
            } else {
                setSuccess("Staff member removed.");
                router.refresh();
            }
        } catch (err: any) {
            setError("Failed to remove staff member.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            {/* Invite Section */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 max-w-xl">
                    <h3 className="text-2xl md:text-3xl font-black mb-3 tracking-tighter">Expand Your Team.</h3>
                    <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">
                        Invite staff members via email. They will get all management permissions.
                        If they don't have an account, they'll be linked automatically upon registration.
                    </p>

                    <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="email"
                            required
                            placeholder="staff@example.com"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            className="flex-1 h-14 bg-white/10 border border-white/20 rounded-2xl px-6 text-sm font-bold placeholder:text-white/30 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all font-mono"
                        />
                        <Button
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-black text-[11px] uppercase tracking-widest px-8 h-14 rounded-2xl border-none shadow-xl shadow-blue-500/20"
                        >
                            {loading ? "Inviting..." : "Send Invite"}
                        </Button>
                    </form>

                    {(error || success) && (
                        <div className={`mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${error ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${error ? 'bg-rose-500' : 'bg-emerald-500'} animate-pulse`} />
                            {error || success}
                        </div>
                    )}
                </div>
            </div>

            {/* List Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Current Protocol Staff ({staff.length})</h4>
                    <div className="h-px bg-slate-100 flex-1 ml-8" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {staff.length === 0 ? (
                        <div className="col-span-full py-12 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                            <p className="text-slate-300 font-bold text-sm">No secondary staff assigned to this store.</p>
                        </div>
                    ) : (
                        staff.map((member, idx) => {
                            const isPending = !member.userId;
                            return (
                                <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${isPending ? 'bg-slate-50 text-slate-300' : 'bg-blue-50 text-blue-600'}`}>
                                            {isPending ? '⏳' : '👤'}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-black text-slate-900 truncate uppercase mt-0.5 tracking-tighter">
                                                {member.email}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">All Perms</span>
                                                {isPending && (
                                                    <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[8px] font-black uppercase tracking-tighter rounded-md border border-amber-100">
                                                        Pending Reg
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(member.userId || member.email)}
                                        className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
