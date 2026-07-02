"use client";

import { memo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
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
        isUrgentExpired?: boolean;
        isFeatured?: boolean;
        condition?: string;
        saleType?: 'sale' | 'rent';
    };
    initialIsFavorited?: boolean;
    isLoggedIn?: boolean;
}

const formatCondition = (condition?: string) => {
    if (!condition) return 'Item';
    switch (condition) {
        case 'new':
            return 'New';
        case 'like-new':
            return 'Like New';
        case 'good':
            return 'Good';
        case 'fair':
            return 'Fair';
        case 'for-parts':
            return 'For Parts';
        default:
            return condition
                .toString()
                .split(/[-_\s]+/)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
    }
};

export const ProductCard = memo(({ product, initialIsFavorited = false, isLoggedIn = false }: ProductCardProps) => {
    const router = useRouter();
    const { data: session } = useSession();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isThinking, setIsThinking] = useState(false);

    // Determine if user is logged in from session or prop
    const userIsLoggedIn = isLoggedIn || !!session?.user;

    // Sync with initial state if it changes
    useEffect(() => {
        setIsFavorited(initialIsFavorited);
    }, [initialIsFavorited]);

    const handleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!userIsLoggedIn) {
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
        if (!userIsLoggedIn) {
            alert("Please register first to share products.");
            router.push('/auth/register');
            return;
        }
        setIsShareModalOpen(true);
    };

    const images = product.images || [];
    const productUrl = typeof window !== 'undefined' ? `${window.location.origin}/products/${product._id}` : '';

    return (
        <>
            <Link href={`/products/${product._id}`} className="block group h-full">
                <div className="h-full flex flex-col bg-white border border-gray-400/40 shadow-none transition-shadow duration-200 relative rounded-sm overflow-hidden hover:shadow-lg group">
                    <div className="z-10 bg-gray-50 border-b border-gray-400/20 py-1 px-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
                                {formatCondition(product.condition)}
                            </span>
                            <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm border ${
                                product.saleType === 'rent' 
                                ? 'bg-orange-50 text-orange-600 border-orange-100' 
                                : 'bg-blue-50 text-blue-600 border-blue-100'
                            }`}>
                                {product.saleType === 'rent' ? 'For Rent' : 'For Sale'}
                            </span>
                        </div>
                        {product.status === 'sold' && (
                            <span className="text-[8px] font-black text-rose-600 uppercase tracking-wider">Sold</span>
                        )}
                    </div>

                    <div className="aspect-square bg-white relative overflow-hidden shrink-0 p-2 border-b border-gray-400/10">
                        {images.length > 0 ? (
                            <Image
                                src={images[currentImageIndex].url}
                                alt={product.title}
                                fill
                                sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 250px"
                                className="object-contain p-2 transition-transform duration-700 group-hover:scale-110"
                                priority={false}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl opacity-10">📦</div>
                        )}

                        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                            {product.isUrgent && !product.isUrgentExpired && (
                                <span className="bg-rose-600 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-sm shadow-xl shadow-rose-100 flex items-center gap-1">
                                    <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                                    Urgent
                                </span>
                            )}
                            {product.isFeatured && (
                                <span className="bg-emerald-600 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-sm shadow-xl shadow-emerald-100 flex items-center gap-1">
                                    <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                                    Featured
                                </span>
                            )}
                        </div>

                        <button
                            onClick={handleFavorite}
                            disabled={isThinking}
                            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
                        >
                            {isFavorited ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-rose-500">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 hover:text-rose-500 transition-colors">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <div className="p-2 md:p-3 flex flex-col flex-1 gap-1">
                        <h3 className="text-xs md:text-sm font-bold text-gray-800 leading-tight line-clamp-2 transition-colors">
                            {product.title}
                        </h3>
                        <div className="space-y-1 mt-auto">
                            <div className="flex items-baseline gap-1">
                                <span className="text-base md:text-lg font-black text-slate-950 tracking-tight">
                                    {product.price.toLocaleString()} <span className="text-[8px] opacity-70">ETB</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-4 h-4 rounded-full bg-slate-50 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                </div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">
                                    {product.category || "General"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                productId={product._id}
                productTitle={product.title}
                productUrl={productUrl}
            />
        </>
    );
});

ProductCard.displayName = "ProductCard";
