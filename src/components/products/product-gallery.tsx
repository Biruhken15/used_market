"use client";

import { useState } from "react";

import Image from "next/image";

/**
 * ProductGallery Component
 * Handles image album display, thumbnail selection, and fullscreen viewer.
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
            <div className="aspect-square md:aspect-[4/3] bg-slate-50 rounded-[2rem] flex items-center justify-center text-4xl opacity-10">
                📦
            </div>
        );
    }

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div
                    className="fixed inset-0 z-[100] bg-black flex items-center justify-center cursor-zoom-out p-4 md:p-12 animate-in fade-in duration-300"
                    onClick={() => setIsFullscreen(false)}
                >
                    <div className="relative w-full h-full">
                        <Image
                            src={images[activeImage]?.url}
                            alt={title}
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <button 
                        className="absolute top-8 right-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                        onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>
            )}

            {/* Main Image View */}
            <div
                className="relative aspect-square md:aspect-[4/3] bg-slate-100 rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm group"
            >
                {/* Mobile Swipe Container */}
                <div className="md:hidden absolute inset-0 flex overflow-x-auto snap-x snap-mandatory thin-scrollbar">
                    {images.map((img: any, idx: number) => (
                        <div key={idx} className="relative w-full h-full flex-shrink-0 snap-center">
                            <Image
                                src={img.url}
                                alt={`${title} ${idx}`}
                                fill
                                className="object-contain p-4"
                                priority={idx === 0}
                            />
                        </div>
                    ))}
                </div>

                {/* Desktop Static View */}
                <div 
                    className="hidden md:block relative w-full h-full cursor-zoom-in"
                    onClick={() => setIsFullscreen(true)}
                >
                    <Image
                        src={images[activeImage]?.url}
                        alt={title}
                        fill
                        className="object-contain p-8"
                        priority
                    />
                    <button 
                        className="absolute bottom-6 right-6 px-6 py-3 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 border border-white shadow-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
                    >
                        Expand View
                    </button>
                </div>
                
                {/* Mobile Indicators */}
                <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 bg-black/20 backdrop-blur-md rounded-full">
                    {images.map((_: any, idx: number) => (
                        <div 
                            key={idx} 
                            className={`w-1.5 h-1.5 rounded-full transition-all ${activeImage === idx ? 'bg-white w-4' : 'bg-white/40'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Thumbnails Navigation */}
            <div className="flex gap-4 overflow-x-auto pb-2 thin-scrollbar">
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
