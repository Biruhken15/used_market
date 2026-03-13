"use client";

import { useState } from "react";

/**
 * ProductEssentials Component
 * Displays Title, Price, Status, Category, and Description (with See More/Less).
 */
interface ProductEssentialsProps {
    title: string;
    price: number;
    status: string;
    category: string;
    description: string;
    priceType: string;
    condition: string;
    location: string;
}

export const ProductEssentials = ({
    title,
    price,
    status,
    category,
    description,
    priceType,
    condition,
    location
}: ProductEssentialsProps) => {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const shouldTruncate = description?.length > 300;
    const displayDescription = isDescriptionExpanded || !shouldTruncate
        ? description
        : `${description?.slice(0, 300)}...`;

    return (
        <div className="space-y-10">
            {/* Title and Price */}
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        {title}
                    </h1>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-4xl font-medium text-slate-900 tracking-tighter">
                            {price.toLocaleString()}
                        </span>
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">ETB</span>
                    </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${status === 'sold' ? 'bg-slate-300' : 'bg-green-400'}`}></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            {status === 'sold' ? 'Sold Out' : 'Active Listing'}
                        </span>
                    </div>
                    <span className="px-3 py-1.5 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-100">
                        {category}
                    </span>
                    <span className="px-3 py-1.5 bg-accent/5 text-accent text-[10px] font-black uppercase tracking-widest rounded-lg border border-accent/10">
                        {priceType}
                    </span>
                </div>
            </div>

            {/* Description & Specs */}
            <div className="space-y-8">
                <div className="space-y-3">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Description</h5>
                    <div className="relative">
                        <p className="text-slate-500 font-medium leading-relaxed text-sm whitespace-pre-line">
                            {displayDescription}
                        </p>
                        {shouldTruncate && (
                            <button
                                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                className="mt-2 text-accent text-xs font-black uppercase tracking-widest hover:underline"
                            >
                                {isDescriptionExpanded ? 'See Less' : 'See More'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Condition</p>
                        <p className="text-xs font-black text-slate-900 uppercase">{condition}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
                        <p className="text-xs font-black text-slate-900">{location}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
