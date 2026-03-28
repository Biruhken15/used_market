"use client";

import { MessageCircle, Phone } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface MobileProductActionsProps {
    store: any;
    productTitle: string;
    productPrice: number;
}

export const MobileProductActions = ({ store, productTitle, productPrice }: MobileProductActionsProps) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleGuestAction = (e: React.MouseEvent, action: string) => {
        if (!session) {
            e.preventDefault();
            alert(`Please register first to ${action}.`);
            router.push('/auth/register');
        }
    };

    const contactText = `Hello! I am interested in your *${productTitle}* listed for *${productPrice.toLocaleString('en-US')} ETB* on Used Market. Link: ${window.location.href}`;
    const encodedContactText = encodeURIComponent(contactText);
    const whatsappUrl = `https://wa.me/${store?.whatsapp || store?.phone}?text=${encodedContactText}`;

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[50] p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex items-center gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <a
                href={`tel:${store?.phone}`}
                className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 active:scale-90 transition-transform"
            >
                <Phone className="w-6 h-6" fill="currentColor" />
            </a>
            
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest active:scale-[0.98] transition-all shadow-lg shadow-green-200"
            >
                <MessageCircle className="w-5 h-5" fill="currentColor" />
                WhatsApp Chat
            </a>

            <button
                onClick={(e) => handleGuestAction(e, "message the seller")}
                className="hidden sm:flex w-14 h-14 rounded-2xl bg-indigo-600 text-white items-center justify-center shrink-0 active:scale-90 transition-transform"
            >
                <MessageCircle className="w-6 h-6" />
            </button>
        </div>
    );
};
