"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";

/**
 * ShareModal Component
 * Provides a clean UI for sharing product links to social media and copying to clipboard.
 */
interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    productTitle: string;
    productUrl: string;
}

export const ShareModal = ({ isOpen, onClose, productTitle, productUrl }: ShareModalProps) => {
    const [copied, setCopied] = useState(false);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const encodedTitle = encodeURIComponent(`Check out this ${productTitle} on Used Market!`);
    const encodedUrl = encodeURIComponent(productUrl);

    const shareLinks = [
        {
            name: "WhatsApp",
            icon: "🟢",
            url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
            bgColor: "bg-green-500",
            hoverColor: "hover:bg-green-600"
        },
        {
            name: "Telegram",
            icon: "🔵",
            url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
            bgColor: "bg-blue-500",
            hoverColor: "hover:bg-blue-600"
        },
        {
            name: "Facebook",
            icon: "🟦",
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            bgColor: "bg-blue-600",
            hoverColor: "hover:bg-blue-700"
        },
        {
            name: "X (Twitter)",
            icon: "𝕏",
            url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            bgColor: "bg-slate-900",
            hoverColor: "hover:bg-black"
        }
    ];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(productUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6" onClick={onClose}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" />

            {/* Modal Card */}
            <div
                className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="text-center space-y-2 mb-8">
                    <div className="w-16 h-16 bg-accent/10 text-accent rounded-3xl flex items-center justify-center text-3xl mx-auto mb-4">
                        🔗
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Share this Product</h3>
                    <p className="text-sm font-medium text-slate-400">Spread the word about this item</p>
                </div>

                {/* Social Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {shareLinks.map((platform) => (
                        <a
                            key={platform.name}
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-3 p-4 rounded-2xl border border-slate-100 font-bold text-slate-700 hover:border-slate-200 hover:bg-slate-50 transition-all group`}
                        >
                            <span className="text-xl group-hover:scale-110 transition-transform">{platform.icon}</span>
                            <span className="text-sm">{platform.name}</span>
                        </a>
                    ))}
                </div>

                {/* Copy Link Section */}
                <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Or Copy Link</p>
                    <div className="flex gap-2 p-2 pl-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <input
                            readOnly
                            value={productUrl}
                            className="bg-transparent border-none outline-none text-xs font-bold text-slate-500 flex-1 overflow-hidden transition-all"
                        />
                        <Button
                            onClick={copyToClipboard}
                            className={`!h-10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${copied ? 'bg-green-500 hover:bg-green-600' : 'bg-slate-900'}`}
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </Button>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-10 h-10 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-200 transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
            </div>
        </div>
    );
};
