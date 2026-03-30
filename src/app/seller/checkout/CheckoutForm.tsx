"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSession } from 'next-auth/react';

interface Plan {
    _id: string;
    planCode: string;
    planName: string;
    price: number;
    durationMonths: number;
    metadata: {
        colorTheme: string;
        tagline: string;
    };
}

export default function CheckoutForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session } = useSession();
    const planId = searchParams.get('planId');
    const tx_ref_query = searchParams.get('tx_ref');

    const [plan, setPlan] = useState<Plan | null>(null);
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [txRef, setTxRef] = useState(tx_ref_query || '');
    const [checkoutUrl, setCheckoutUrl] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'telebirr' | 'cbe_birr' | 'mpesa'>('telebirr');

    // Subscriber Info State
    const [subscriberName, setSubscriberName] = useState('');
    const [subscriberEmail, setSubscriberEmail] = useState('');
    const [subscriberPhone, setSubscriberPhone] = useState('');

    useEffect(() => {
        if (planId) {
            fetch(`/api/subscriptions/plans`)
                .then(res => res.json())
                .then(data => {
                    const selected = data.find((p: any) => p._id === planId);
                    if (selected) setPlan(selected);
                });
        }

        // Fetch store info to pre-fill subscriber details
        fetch('/api/stores')
            .then(res => res.json())
            .then(data => {
                if (data.store) {
                    setSubscriberName(data.store.sellerName || session?.user?.name || '');
                    setSubscriberEmail(data.store.email || session?.user?.email || '');
                    setSubscriberPhone(data.store.phone || '');
                }
            });
    }, [planId, session]);

    const handleCheckout = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/subscriptions/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planId,
                    paymentMethod,
                    subscriberName,
                    subscriberEmail,
                    subscriberPhone
                }),
            });
            const data = await res.json();

            if (data.status === 'success') {
                setCheckoutUrl(data.data.checkout_url);
                setTxRef(data.tx_ref || ''); // Depending on how we return it

                // If it's a real Chapa URL, redirect
                if (data.data.checkout_url.startsWith('http')) {
                    window.location.href = data.data.checkout_url;
                } else {
                    // Mock flow
                    setSuccess(true);
                }
            } else {
                const errorMsg = typeof data.message === 'object'
                    ? JSON.stringify(data.message)
                    : (data.message || data.error || 'Checkout failed');
                throw new Error(errorMsg);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyMock = async () => {
        setVerifying(true);
        try {
            const res = await fetch(`/api/subscriptions/verify?tx_ref=${txRef}`);
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            router.push('/seller/mystore?subscribed=true');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setVerifying(false);
        }
    };

    if (!plan) return (
        <div className="p-20 text-center font-black uppercase text-xs tracking-widest text-foreground/20 italic">
            Retrieving Plan Integrity...
        </div>
    );

    const currentPrice = plan.price;

    const getDurationText = () => {
        if (plan.durationMonths === 1) return '1 Month';
        if (plan.durationMonths === 3) return '3 Months';
        if (plan.durationMonths === 12) return '1 Year';
        return `${plan.durationMonths} Months`;
    };

    return (
        <div className="max-w-4xl mx-auto p-6 pt-12">
            <header className="mb-12">
                <h1 className="text-5xl font-bold tracking-tighter text-slate-900 mb-2">Secure <span className="text-violet-600">Checkout</span></h1>
                <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-[0.3em]">Transaction Powered by Chapa</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <Card className="p-10 rounded-[3rem] border-none shadow-2xl bg-white space-y-8 relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-slate-900 italic mb-6">Subscription Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Plan</span>
                                <span className="text-slate-900 font-bold">{plan.planName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Duration</span>
                                <span className="text-slate-900 font-bold">{getDurationText()}</span>
                            </div>
                            <hr className="border-slate-100 my-8" />
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 block underline decoration-violet-500 decoration-2 underline-offset-4">Total Amount</span>
                                    <span className="text-4xl font-bold text-slate-900">{(currentPrice ?? 0).toLocaleString()} <span className="text-sm">ETB</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-50 rounded-full opacity-50" />
                </Card>

                <div className="space-y-10">
                    <section className="bg-white p-8 rounded-[2rem] border border-slate-50 space-y-6">
                        <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-2 tracking-widest">Subscriber Information</label>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={subscriberName}
                                    onChange={(e) => setSubscriberName(e.target.value)}
                                    placeholder="Legal Name"
                                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none text-slate-900 font-semibold placeholder:text-slate-200 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={subscriberEmail}
                                        onChange={(e) => setSubscriberEmail(e.target.value)}
                                        placeholder="receipt@example.com"
                                        className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none text-slate-900 font-semibold placeholder:text-slate-200 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={subscriberPhone}
                                        onChange={(e) => setSubscriberPhone(e.target.value)}
                                        placeholder="0911..."
                                        className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none text-slate-900 font-semibold placeholder:text-slate-200 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-4 tracking-widest">Select Payment Method</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                                { id: 'telebirr', name: 'Telebirr', icon: '📱' },
                                { id: 'cbe_birr', name: 'CBE Birr', icon: '🏦' },
                                { id: 'mpesa', name: 'M-Pesa', icon: '💸' }
                            ].map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setPaymentMethod(method.id as any)}
                                    className={`p-4 rounded-2xl border-2 text-center transition-all ${paymentMethod === method.id
                                        ? 'border-violet-600 bg-violet-50/50'
                                        : 'border-slate-100 bg-white hover:border-slate-200'
                                        }`}
                                >
                                    <div className="text-2xl mb-1">{method.icon}</div>
                                    <span className={`font-bold text-[10px] uppercase tracking-wider ${paymentMethod === method.id ? 'text-violet-700' : 'text-slate-500'}`}>
                                        {method.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {!success ? (
                        <div className="space-y-6">
                            {error && (
                                <div className="p-4 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-100 italic">
                                    {error}
                                </div>
                            )}

                            <Button
                                onClick={handleCheckout}
                                disabled={loading}
                                className="w-full h-20 rounded-[2.5rem] bg-slate-900 text-white font-bold text-xl hover:bg-violet-600 transition-all shadow-2xl shadow-slate-200 border-none group"
                            >
                                {loading ? 'Securing Gateway...' : (
                                    <span className="flex items-center justify-center gap-4">
                                        Proceed to Payment
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                                    </span>
                                )}
                            </Button>

                            <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">
                                Universal gateway supporting Telebirr, CBE Birr, <br />M-Pesa, and International Cards.
                            </p>
                        </div>
                    ) : (
                        <Card className="p-10 rounded-[3rem] bg-emerald-50 border-4 border-emerald-100 shadow-xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-emerald-700 italic">Gateway Handshake Successful.</h3>
                                <p className="text-xs font-bold text-emerald-600/60 uppercase tracking-widest leading-relaxed">
                                    Mock reference: <span className="text-emerald-700">{txRef}</span>
                                </p>
                            </div>

                            <p className="text-[10px] text-emerald-600/50 font-bold italic tracking-tight leading-relaxed">
                                * In production, you would be redirected to Chapa's secure hosted payment page.
                                Click below to simulate a successful transaction callback.
                            </p>

                            <Button
                                onClick={handleVerifyMock}
                                disabled={verifying}
                                className="w-full h-16 rounded-[2rem] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg border-none shadow-xl shadow-emerald-200"
                            >
                                {verifying ? 'Validating...' : 'Simulate Success Payment'}
                            </Button>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
