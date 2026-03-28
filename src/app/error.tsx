'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-violet-50 rounded-[2.5rem] flex items-center justify-center text-violet-600 shadow-xl shadow-indigo-50 border border-violet-100">
                        <AlertCircle size={48} strokeWidth={1.5} />
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 rounded-full border border-red-100">
                        <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Protocol Interrupted</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Something went wrong</h1>
                    <p className="text-slate-500 font-bold text-sm leading-relaxed px-6">
                        An unexpected error occurred in our systems. Our technical protocol has been alerted.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                        onClick={() => reset()}
                        className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-xl shadow-indigo-100 transition-all border-none"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Restart Phase
                    </Button>
                    <Link href="/" className="flex-1">
                        <Button
                            variant="outline"
                            className="w-full h-14 rounded-2xl border-2 border-slate-200 text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Return Home
                        </Button>
                    </Link>
                </div>

                <div className="pt-6 flex flex-col items-center">
                    <span className="text-[20px] font-black text-slate-900 tracking-tighter italic">ከሰው እጅ</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Marketplace Standards</span>
                </div>
            </div>
        </div>
    );
}
