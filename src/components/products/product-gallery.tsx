"use client";

import { useState } from "react";

/**
 * ProductGallery Component
 * Handles image album display, thumbnail selection, and fullscreen viewer.
 * Uses object-contain to ensure the full image is visible without cropping.
 */
interface ProductGalleryProps {
    images: { url: string }[];
    title: string;
}

export const ProductGallery = ({ images, title }: ProductGalleryProps) => {
    const [activeImage, setActiveImage] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[4/3] bg-slate-50 rounded-[2rem] flex items-center justify-center text-4xl opacity-10">
                📦
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div
                    className="fixed inset-0 z-[100] bg-black flex items-center justify-center cursor-zoom-out p-4 md:p-12 animate-in fade-in duration-300"
                    onClick={() => setIsFullscreen(false)}
                >
                    <img
                        src={images[activeImage]?.url}
                        alt={title}
                        className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                    />
                    <div className="absolute top-8 right-8 text-white/50 text-xs font-black uppercase tracking-widest">
                        Click anywhere to exit
                    </div>
                </div>
            )}

            {/* Main Image View - Uses object-contain to avoid cropping */}
            <div
                className="relative aspect-[4/3] bg-slate-100 rounded-[2rem] overflow-hidden border border-slate-100 cursor-zoom-in transition-all duration-500 shadow-sm"
                onClick={() => setIsFullscreen(true)}
            >
                <img
                    src={images[activeImage]?.url}
                    alt={title}
                    className="w-full h-full object-contain"
                />
                <div className="absolute top-6 right-6 px-4 py-2 bg-white/80 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 border border-white">
                    Click to Fullscreen
                </div>
            </div>

            {/* Thumbnails Navigation */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img: any, idx: number) => (
                    <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 bg-slate-50 transition-all ${activeImage === idx ? 'border-accent shadow-lg shadow-accent/10 scale-105' : 'border-transparent hover:border-slate-200'}`}
                    >
                        <img src={img.url} className="w-full h-full object-contain" alt={`${title} thumb ${idx}`} />
                    </button>
                ))}
            </div>
        </div>
    );
};
