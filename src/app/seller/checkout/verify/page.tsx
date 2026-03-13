'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

function VerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tx_ref = searchParams.get('tx_ref');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your payment protocol...');

    useEffect(() => {
        if (!tx_ref) {
            setStatus('error');
            setMessage('Invalid transaction reference.');
            return;
        }

        const verifyPayment = async () => {
            try {
                const response = await fetch(`/api/subscriptions/verify?tx_ref=${tx_ref}`);
                const data = await response.json();

                if (data.success) {
                    setStatus('success');
                    setMessage('Payment verified successfully! Your store features are now active.');
                    // Redirect after 3 seconds
                    setTimeout(() => {
                        router.push('/seller/mystore');
                    }, 3000);
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Verification failed. Please contact support.');
                }
            } catch (error) {
                console.error('Verification error:', error);
                setStatus('error');
                setMessage('An error occurred during verification.');
            }
        };

        verifyPayment();
    }, [tx_ref, router]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex justify-center">
                    <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-lg transition-all duration-500 ${status === 'loading' ? 'bg-blue-50 text-blue-600 animate-pulse' :
                            status === 'success' ? 'bg-emerald-50 text-emerald-600' :
                                'bg-red-50 text-red-600'
                        }`}>
                        {status === 'loading' && <Loader2 className="w-12 h-12 animate-spin" />}
                        {status === 'success' && <CheckCircle2 className="w-12 h-12" />}
                        {status === 'error' && <XCircle className="w-12 h-12" />}
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
                        {status === 'loading' ? 'Verifying Protocol' :
                            status === 'success' ? 'Access Granted' : 'Verification Denied'}
                    </h1>
                    <p className="text-sm font-bold text-slate-500 leading-relaxed px-4 text-center">
                        {message}
                    </p>
                </div>

                {status === 'loading' && (
                    <div className="pt-4 flex flex-col items-center gap-3">
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full w-2/3 rounded-full animate-pulse" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            Encryption Phase: Syncing
                        </span>
                    </div>
                )}

                {status !== 'loading' && (
                    <div className="pt-4 space-y-4">
                        <Link href="/seller/mystore" className="block w-full">
                            <Button className="w-full !h-14 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-widest hover:bg-accent transition-all shadow-xl shadow-slate-200 border-none">
                                Go to Store Dashboard
                            </Button>
                        </Link>
                        {status === 'error' && (
                            <Link href="/pricing" className="block w-full">
                                <Button variant="outline" className="w-full !h-14 rounded-2xl border-2 border-slate-200 font-black text-sm uppercase tracking-widest hover:border-slate-900 transition-all">
                                    Back to Pricing
                                </Button>
                            </Link>
                        )}
                    </div>
                )}

                <div className="pt-4 flex items-center justify-center gap-2 text-slate-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Secure Verification Protocol</span>
                </div>
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
}
