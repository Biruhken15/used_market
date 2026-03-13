"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { submitStoreReviewAction } from '@/lib/actions/review-actions';
import { useRouter } from 'next/navigation';

interface StoreReviewFormProps {
    storeId: string;
    storeName: string;
}

export function StoreReviewForm({ storeId, storeName }: StoreReviewFormProps) {
    const router = useRouter();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("storeId", storeId);
        formData.append("rating", rating.toString());
        formData.append("comment", comment);

        try {
            const result = await submitStoreReviewAction(formData);
            if (result.error) {
                setError(result.error);
            } else {
                setSuccess(true);
                setComment("");
                router.refresh();
            }
        } catch (err: any) {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2rem] text-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg shadow-emerald-200">
                    ✓
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2">Protocol Feedback Logged!</h4>
                <p className="text-emerald-600/70 font-medium text-sm">Your experience with {storeName} has been recorded.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
            <div>
                <h4 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">Rate your Experience</h4>
                <p className="text-slate-400 text-sm font-medium">How was your interaction with {storeName}?</p>
            </div>

            {/* Rating Stars */}
            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Merchant Rating</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all ${star <= rating
                                    ? 'bg-amber-50 text-amber-500 scale-110'
                                    : 'bg-slate-50 text-slate-300 hover:bg-slate-100'
                                }`}
                        >
                            ★
                        </button>
                    ))}
                </div>
            </div>

            {/* Comment */}
            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Engagement Summary</label>
                <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe your purchase or interaction with the merchant..."
                    className="w-full bg-slate-50 border-2 border-transparent rounded-[1.5rem] p-6 text-sm font-medium placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none min-h-[150px]"
                />
            </div>

            {error && (
                <div className="p-4 bg-rose-50 text-rose-500 text-xs font-bold rounded-xl border border-rose-100 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    {error}
                </div>
            )}

            <Button
                disabled={loading}
                className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-slate-200 border-none transition-all active:scale-[0.98]"
            >
                {loading ? "Processing..." : "Publish Review"}
            </Button>
        </form>
    );
}
