"use client";

import React from 'react';
const formatDate = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

interface Review {
    _id: string;
    userId: {
        _id: string;
        name: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
}

interface StoreReviewsProps {
    reviews: Review[];
    storeName: string;
}

export function StoreReviews({ reviews, storeName }: StoreReviewsProps) {
    if (reviews.length === 0) {
        return (
            <div className="py-20 text-center space-y-4">
                <div className="text-5xl text-slate-200">★</div>
                <h4 className="text-xl font-bold text-slate-300">No merchant reviews yet.</h4>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">Be the first to share your experience with {storeName}!</p>
            </div>
        );
    }

    const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    return (
        <div className="space-y-12">
            {/* Summary Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-12 transition-all">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-amber-50 rounded-[2rem] flex flex-col items-center justify-center border border-amber-100">
                        <span className="text-3xl font-black text-amber-600">{averageRating.toFixed(1)}</span>
                        <span className="text-[10px] font-black text-amber-500/50 uppercase tracking-widest mt-1">Merchant Rating</span>
                    </div>
                    <div>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tighter">Trust Spectrum</h4>
                        <p className="text-slate-400 text-sm font-medium">Aggregate feedback for the {storeName} protocol.</p>
                    </div>
                </div>
            </div>

            {/* Review List */}
            <div className="grid grid-cols-1 gap-8">
                {reviews.map((review) => (
                    <div key={review._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-blue-100 transition-all hover:shadow-xl hover:shadow-slate-100/50 group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-lg font-black text-slate-400">
                                    {review.userId.name.charAt(0)}
                                </div>
                                <div>
                                    <h5 className="text-sm font-black text-slate-900 uppercase tracking-tight">{review.userId.name}</h5>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {formatDate(new Date(review.createdAt))}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star} className={`text-sm ${star <= review.rating ? 'text-amber-400' : 'text-slate-100'}`}>
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>
                        <p className="text-slate-600 text-sm font-medium leading-relaxed italic">
                            "{review.comment}"
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
