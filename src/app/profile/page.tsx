"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(session?.user?.name || "");
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    if (!session) return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
            <p className="text-slate-400 font-semibold uppercase tracking-[0.25em]">Loading account settings...</p>
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

            await update({ name });
            setMessage({ type: 'success', text: 'Profile updated successfully.' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 pt-28 pb-12">
            <div className="w-full max-w-xl space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h1 className="text-3xl font-bold text-slate-900">Your profile</h1>

                    <div className="mt-8 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Full name</label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your full name"
                                className="mt-3 h-14 rounded-2xl border-slate-200 bg-white px-4 text-sm text-slate-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Email address</label>
                            <div className="mt-3 flex h-14 items-center rounded-2xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-600">
                                {session.user.email}
                            </div>
                        </div>

                        <Button
                            disabled={loading || name === session.user.name}
                            onClick={handleUpdateProfile}
                            className="w-full h-14 rounded-2xl bg-slate-900 text-sm font-semibold uppercase tracking-[0.2em] text-white hover:bg-slate-800 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save changes'}
                        </Button>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="rounded-full px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                    >
                        Sign out
                    </button>
                </div>

                {message && (
                    <div className={`rounded-2xl border px-4 py-4 text-sm font-semibold text-center ${message.type === 'success' ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-rose-100 bg-rose-50 text-rose-700'}`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
}
