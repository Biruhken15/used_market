"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ShareModal } from "./share-modal";

/**
 * ProductEssentials Component
 * Displays Title, Price, Status, Category, and Description (with See More/Less).
 */
interface ProductEssentialsProps {
    productId: string;
    title: string;
    price: number;
    status: string;
    category: string;
    description: string;
    priceType: string;
    condition: string;
    location: string;
    initialIsFavorited?: boolean;
}

export const ProductEssentials = ({
    productId,
    title,
    price,
    status,
    category,
    description,
    priceType,
    condition,
    location,
    initialIsFavorited = false
}: ProductEssentialsProps) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isThinking, setIsThinking] = useState(false);

    useEffect(() => {
        setIsFavorited(initialIsFavorited);
    }, [initialIsFavorited]);

    const handleFavorite = async () => {
        if (!session) {
            alert("Please register first to favorite products.");
            router.push('/auth/register');
            return;
        }
        if (isThinking) return;
        setIsThinking(true);
        try {
            const res = await fetch(`/api/favorites/${productId}`, { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                setIsFavorited(data.favorited);
                window.dispatchEvent(new Event('favoritesUpdated'));
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        } finally {
            setIsThinking(false);
        }
    };

    const handleShare = () => {
        setIsShareModalOpen(true);
    };

    const productUrl = typeof window !== 'undefined' ? window.location.href : '';

    const truncatedLimit = 200;
    const shouldTruncate = description?.length > truncatedLimit;
    const displayDescription = isDescriptionExpanded || !shouldTruncate
        ? description
        : `${description?.slice(0, truncatedLimit)}...`;

    return (
        <div className="space-y-10 w-full max-w-full overflow-hidden">
            {/* Title and Price */}
            <div className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight break-words flex-1">
                            {title}
                        </h1>
                        <div className="flex items-center gap-2 pt-1">
                            {/* Favorite Button */}
                            <button
                                onClick={handleFavorite}
                                disabled={isThinking}
                                className={`w-10 h-10 rounded-[0.85rem] border flex items-center justify-center transition-all active:scale-95 ${
                                    isFavorited 
                                    ? 'bg-rose-50 border-rose-100 text-rose-500 shadow-sm' 
                                    : 'bg-white border-slate-200/80 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50/50'
                                }`}
                                title={isFavorited ? "Unfavorite" : "Favorite"}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={isThinking ? "animate-pulse" : ""}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                            </button>

                            {/* Share Button */}
                            <button
                                onClick={handleShare}
                                className="w-10 h-10 rounded-[0.85rem] bg-white border border-slate-200/80 text-slate-400 hover:text-violet-600 hover:border-violet-200 hover:bg-violet-50/50 flex items-center justify-center transition-all active:scale-95 shadow-sm"
                                title="Share"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
                            </button>

                            {/* Chat Button */}
                            <button
                                className="ml-3 h-10 px-4 rounded-[0.85rem] bg-slate-900 border border-slate-900 text-white hover:bg-slate-800 flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-slate-200/50"
                                title="Chat with Seller"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                                <span className="text-[10px] font-black uppercase tracking-widest pt-0.5">Chat</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1.5 flex-wrap">
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
                    <div className="relative w-full max-w-full overflow-hidden">
                        <p className="text-slate-500 font-medium leading-relaxed text-sm whitespace-pre-line break-words overflow-hidden">
                            {displayDescription}
                        </p>
                        {shouldTruncate && (
                            <button
                                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                className="mt-2 text-violet-600 text-xs font-black uppercase tracking-widest hover:underline"
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
            
            <ShareModal 
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                productId={productId}
                productTitle={title}
                productUrl={productUrl}
            />
        </div>
    );
};
