"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface TrialExpiryPopupProps {
    isExpired: boolean;
    planName: string;
}

export default function TrialExpiryPopup({ isExpired, planName }: TrialExpiryPopupProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isExpired) {
            // Check if user has already dismissed it this session
            const dismissed = sessionStorage.getItem('trial_expiry_dismissed');
            if (!dismissed) {
                setShow(true);
            }
        }
    }, [isExpired]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center text-4xl shadow-inner">
                    ⏳
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">Trial Period Ended.</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                        Your {planName} has completed its cycle. <br />Upgrade now to keep your store active and growing.
                    </p>
                </div>

                <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 italic text-[11px] font-bold text-slate-500 italic">
                    "Upgrade to sell with better features and reach more customers across Ethiopia."
                </div>

                <div className="flex flex-col w-full gap-3 pt-4">
                    <Link href="/pricing" className="w-full">
                        <Button className="w-full !h-14 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-widest hover:bg-accent transition-all shadow-xl shadow-slate-200 border-none group">
                            Upgrade Now
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:translate-x-1 transition-transform"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                        </Button>
                    </Link>
                    <button
                        onClick={() => {
                            setShow(false);
                            sessionStorage.setItem('trial_expiry_dismissed', 'true');
                        }}
                        className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-500 transition-colors py-2"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
}
