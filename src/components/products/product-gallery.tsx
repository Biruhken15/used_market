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

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveImage((prev) => (prev + 1) % images.length);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveImage((prev) => (prev - 1 + images.length) % images.length);
    };

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
                    
                    {/* Modal Controls */}
                    <div className="absolute inset-x-4 md:inset-x-12 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                        <button 
                            onClick={handlePrev}
                            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all pointer-events-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        </button>
                        <button 
                            onClick={handleNext}
                            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all pointer-events-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        </button>
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
                className="relative aspect-square md:aspect-[4/3] bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm group"
            >
                {/* Image Container */}
                <div 
                    className="relative w-full h-full cursor-zoom-in"
                    onClick={() => setIsFullscreen(true)}
                >
                    <Image
                        src={images[activeImage]?.url}
                        alt={title}
                        fill
                        className="object-contain p-4 md:p-12 transition-transform duration-700"
                        priority
                    />
                </div>

                {/* Navigation Arrows - Visible on Desktop hover, always on Mobile */}
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={handlePrev}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-900 hover:bg-white transition-all shadow-xl border border-slate-100 pointer-events-auto active:scale-90"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <button 
                        onClick={handleNext}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-900 hover:bg-white transition-all shadow-xl border border-slate-100 pointer-events-auto active:scale-90"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                </div>
                
                {/* View Status */}
                <div className="absolute bottom-6 left-6 px-4 py-2 bg-slate-900/10 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-slate-900">
                    {activeImage + 1} / {images.length}
                </div>

                <button 
                    disabled
                    className="absolute bottom-6 right-6 px-6 py-3 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 border border-white shadow-xl opacity-0 md:group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 hidden md:block"
                >
                    Expand View
                </button>
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
