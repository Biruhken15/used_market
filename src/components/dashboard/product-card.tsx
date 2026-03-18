"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "../ui/card";
import { ShareModal } from "../products/share-modal";

interface ProductCardProps {
    product: {
        _id: string;
        title: string;
        price: number;
        category: string;
        status: string;
        images?: { url: string }[];
        rankingScore?: number;
        isUrgent?: boolean;
        isFeatured?: boolean;
    };
    initialIsFavorited?: boolean;
}

export const ProductCard = ({ product, initialIsFavorited = false }: ProductCardProps) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isThinking, setIsThinking] = useState(false);

    // Sync with initial state if it changes
    useEffect(() => {
        setIsFavorited(initialIsFavorited);
    }, [initialIsFavorited]);

    const handleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!session) {
            alert("Please register first to favorite products.");
            router.push('/auth/register');
            return;
        }

        if (isThinking) return;

        setIsThinking(true);
        try {
            const res = await fetch(`/api/favorites/${product._id}`, { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                setIsFavorited(data.favorited);
                // Dispatch event for Navbar to update count
                window.dispatchEvent(new Event('favoritesUpdated'));
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        } finally {
            setIsThinking(false);
        }
    };

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!session) {
            alert("Please register first to share products.");
            router.push('/auth/register');
            return;
        }

        setIsShareModalOpen(true);
    };

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.images && product.images.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % product.images!.length);
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.images && product.images.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + product.images!.length) % product.images!.length);
        }
    };

    const images = product.images || [];
    const productUrl = typeof window !== 'undefined' ? `${window.location.origin}/products/${product._id}` : '';

    return (
        <>
            <Link href={`/products/${product._id}`} className="block group h-full">
                <Card className="premium-card h-full flex flex-col overflow-hidden bg-white border-slate-100 transition-all duration-500 relative shadow-sm hover:shadow-2xl hover:shadow-accent/5 rounded-[1.5rem] border-none">

                    {/* Image Section */}
                    <div className="aspect-[4/5] bg-slate-50 relative overflow-hidden shrink-0">
                        {images.length > 0 ? (
                            <>
                                <img
                                    src={images[currentImageIndex].url}
                                    alt={product.title}
                                    className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105"
                                />

                                {/* Navigation Arrows */}
                                {images.length > 1 && (
                                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={nextImage}
                                            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-lg active:scale-90"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-6xl opacity-10">📦</div>
                        )}

                        {/* Status Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                            {product.status === 'sold' && (
                                <span className="bg-slate-900/90 backdrop-blur-sm text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg shadow-sm">
                                    Sold Out
                                </span>
                            )}
                        </div>

                        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 items-end">
                            {product.isUrgent && (
                                <span className="bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg shadow-lg shadow-amber-500/20 italic animate-pulse">
                                    Urgent
                                </span>
                            )}
                            {product.isFeatured && (
                                <span className="bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg shadow-lg shadow-blue-600/20 italic">
                                    Featured
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex flex-col flex-1">
                        {/* Row 1: Title & Price */}
                        <div className="flex justify-between items-start gap-3 mb-2">
                            <h3 className="text-[17px] font-bold text-slate-900 leading-tight group-hover:text-accent transition-colors line-clamp-2">
                                {product.title}
                            </h3>
                            <div className="flex items-baseline gap-0.5 shrink-0">
                                <span className="text-[17px] font-medium text-slate-900 tracking-tighter">
                                    {product.price.toLocaleString()}
                                </span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase">ETB</span>
                            </div>
                        </div>

                        {/* Row 2: Status & Category */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${product.status === 'sold' ? 'bg-slate-300' : 'bg-green-400'}`}></div>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    {product.status === 'sold' ? 'Sold' : 'Active'}
                                </span>
                            </div>
                            <span className="text-[9px] font-bold text-slate-400 border border-slate-50 px-2 py-0.5 rounded-md uppercase tracking-widest bg-slate-50/50">
                                {product.category || "Used"}
                            </span>
                        </div>

                        {/* Row 3: Buttons - Visible to all, Guest triggers redirect */}
                        <div className="mt-auto flex gap-2 pt-3 border-t border-slate-50">
                            <button
                                onClick={handleFavorite}
                                disabled={isThinking}
                                className={`flex-1 h-10 rounded-xl border border-slate-100 flex items-center justify-center transition-all active:scale-95 ${isFavorited
                                    ? 'text-rose-500 border-rose-100 bg-rose-50'
                                    : 'text-slate-500 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50'
                                    }`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill={isFavorited ? "currentColor" : "none"}
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={isThinking ? "animate-pulse" : ""}
                                >
                                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                                </svg>
                            </button>
                            <button
                                onClick={handleShare}
                                className="flex-1 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-500 hover:text-accent hover:border-accent/10 hover:bg-accent/5 transition-all active:scale-95"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" /></svg>
                            </button>
                        </div>
                    </div>
                </Card>
            </Link>

            {/* Share Modal */}
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                productTitle={product.title}
                productUrl={productUrl}
            />
        </>
    );
};
