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
        condition?: string;
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
                <div className="h-full flex flex-col bg-white border border-slate-100 transition-all duration-300 relative rounded-xl overflow-hidden hover:shadow-xl group-hover:border-slate-200">
                    
                    {/* Condition Badge (Very Top) */}
                    <div className="bg-slate-50 border-b border-slate-100 py-1.5 px-3 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                            {product.condition || "Marketplace Item"}
                        </span>
                        {product.status === 'sold' && (
                            <span className="text-[9px] font-black text-rose-500 uppercase tracking-wider">Sold Out</span>
                        )}
                    </div>

                    {/* Image Section */}
                    <div className="aspect-square bg-slate-50 relative overflow-hidden shrink-0 p-4">
                        {images.length > 0 ? (
                            <img
                                src={images[currentImageIndex].url}
                                alt={product.title}
                                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl opacity-10">📦</div>
                        )}

                        {/* Status Tags (Top Left of Image) */}
                        <div className="absolute top-4 left-4 flex flex-col gap-1">
                            {product.isUrgent && (
                                <span className="bg-blue-600 text-white text-[9px] font-black uppercase tracking-tighter px-2 py-1 rounded-sm shadow-sm">
                                    Urgent
                                </span>
                            )}
                            {product.isFeatured && (
                                <span className="bg-green-500 text-white text-[9px] font-black uppercase tracking-tighter px-2 py-1 rounded-sm shadow-sm">
                                    Top Pick
                                </span>
                            )}
                            {product.category === 'real-estate' && (
                                <span className="bg-amber-500 text-white text-[9px] font-black uppercase tracking-tighter px-2 py-1 rounded-sm shadow-sm">
                                    Property
                                </span>
                            )}
                            {product.category === 'vehicles' && (
                                <span className="bg-slate-700 text-white text-[9px] font-black uppercase tracking-tighter px-2 py-1 rounded-sm shadow-sm">
                                    Vehicle
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 flex flex-col flex-1 gap-2">
                        <h3 className="text-[13px] font-bold text-slate-700 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {product.title}
                        </h3>
                        
                        <div className="space-y-0.5 mt-auto">
                            <div className="flex items-baseline gap-1">
                                <span className="text-lg font-black text-slate-900 tracking-tight">
                                    {product.price.toLocaleString()} <span className="text-[10px] opacity-70">ETB</span>
                                </span>
                            </div>
                            
                            {/* Location & Meta info */}
                            <div className="flex items-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                                    {product.category || "General"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
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
