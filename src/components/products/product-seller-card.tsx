"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

/**
 * ProductSellerCard Component
 * Displays store information, branding, and all contact buttons.
 * Includes explicit "Store Name" label as requested.
 */
interface ProductSellerCardProps {
    store: {
        storeName: string;
        logo?: { url: string };
        city: string;
        address: string;
        phone: string;
        whatsapp?: string;
        telegram?: string;
        email: string;
    };
    productTitle: string;
    productPrice: number;
    pageUrl: string;
}

export const ProductSellerCard = ({ store, productTitle, productPrice, pageUrl }: ProductSellerCardProps) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleGuestAction = (e: React.MouseEvent, action: string) => {
        if (!session) {
            e.preventDefault();
            alert(`Please register first to ${action}.`);
            router.push('/auth/register');
        }
    };

    // Contact URIs (Encode the text safely and force en-US to prevent hydration mismatches)
    // We strictly use `mounted ? pageUrl : ""` so the initial client render perfectly matches the server's empty string.
    const hydratedPageUrl = mounted && pageUrl ? pageUrl : "";
    const contactText = `Hello! I am interested in your *${productTitle}* listed for *${productPrice.toLocaleString('en-US')} ETB* on Used Market. Link: ${hydratedPageUrl}`;
    const encodedContactText = encodeURIComponent(contactText);

    const whatsappUrl = `https://wa.me/${store?.whatsapp || store?.phone}?text=${encodedContactText}`;
    
    let telegramUrl = store?.telegram?.startsWith('http') ? store.telegram : `https://t.me/${store?.telegram?.replace('@', '')}`;
    if (telegramUrl && !telegramUrl.includes('text=')) {
        telegramUrl += `${telegramUrl.includes('?') ? '&' : '?'}text=${encodedContactText}`;
    }

    return (
        <div className="p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 bg-slate-50/30 space-y-6 md:space-y-8">
            {/* Store Branding - Now Interactive for Guests */}
            <div
                className="flex items-center gap-4 pb-6 md:pb-8 border-b border-slate-100 cursor-pointer group/store hover:opacity-80 transition-opacity"
                onClick={(e) => handleGuestAction(e, "view store details")}
            >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center text-3xl overflow-hidden shadow-sm border border-slate-100 group-hover/store:border-violet-600/30 transition-colors shrink-0">
                    {store?.logo?.url ? <img src={store.logo.url} className="w-full h-full object-cover" alt="Store logo" /> : "🏪"}
                </div>
                <div className="space-y-0.5">
                    <p className="text-[9px] md:text-[10px] font-black text-violet-600 uppercase tracking-widest mb-1">Store Name</p>
                    <h4 className="font-extrabold text-slate-900 text-base md:text-lg leading-tight group-hover/store:text-violet-600 transition-colors line-clamp-1">{store?.storeName}</h4>
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{store?.city || 'Addis Ababa'}, Ethiopia</p>
                </div>
            </div>

            {/* Contact Options Grid */}
            <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Connect with Seller</h5>
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                    {/* WhatsApp */}
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center gap-2 p-5 bg-white hover:bg-green-50 rounded-[1.5rem] border border-slate-100 hover:border-green-200 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">WhatsApp</span>
                    </a>

                    {/* Telegram */}
                    {store?.telegram && (
                        <a
                            href={telegramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center gap-2 p-5 bg-white hover:bg-violet-50 rounded-[1.5rem] border border-slate-100 hover:border-violet-200 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Telegram</span>
                        </a>
                    )}

                    {/* Direct Call */}
                    <a
                        href={`tel:${store?.phone}`}
                        className="flex flex-col items-center justify-center gap-2 p-5 bg-white hover:bg-slate-50 rounded-[1.5rem] border border-slate-100 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15.05 5A5 5 0 0 1 19 8.95" /><path d="M15.05 1A9 9 0 0 1 23 8.94" /><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Call Now</span>
                    </a>

                    {/* Email */}
                    <a
                        href={`mailto:${store?.email}`}
                        className="flex flex-col items-center justify-center gap-2 p-5 bg-white hover:bg-slate-50 rounded-[1.5rem] border border-slate-100 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Email</span>
                    </a>
                </div>

                {/* In-App Chat Backup - Visible to all, Guest triggers redirect */}
                <Button
                    onClick={(e) => handleGuestAction(e, "message the seller")}
                    className="w-full !h-14 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 mt-2 hover:brightness-110 transition-all hover:scale-[1.02] active:scale-95"
                >
                    Message in Marketplace
                </Button>
            </div>
        </div>
    );
};
