"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toggleUrgentAction } from '@/lib/actions/product-actions';
import { Sparkles, Zap } from 'lucide-react';

interface InventoryListProps {
    initialProducts: any[];
    storeId: string;
    subscriptionFeatures: any;
}

export default function InventoryList({ initialProducts, storeId, subscriptionFeatures }: InventoryListProps) {
    const router = useRouter();
    const [products, setProducts] = useState(initialProducts);

    const [loading, setLoading] = useState<string | null>(null);

    const handleMarkAsSold = async (productId: string) => {
        if (!confirm('Mark this item as sold?')) return;
        setLoading(productId);
        try {
            const res = await fetch(`/api/products/${productId}/sold`, { method: 'PATCH' });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setProducts(products.map(p => p._id === productId ? { ...p, status: 'sold' } : p));
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(null);
        }
    };

    const handleDelete = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this listing?')) return;
        setLoading(productId);
        try {
            const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setProducts(products.filter(p => p._id !== productId));
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(null);
        }
    };

    const handleToggleUrgent = async (productId: string) => {
        setLoading(productId);
        try {
            const result = await toggleUrgentAction(productId, storeId);
            if (result.error) throw new Error(result.error);

            setProducts(products.map(p => p._id === productId ? { ...p, isUrgent: !p.isUrgent } : p));
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(null);
        }
    };

    if (products.length === 0) {
        return (
            <div className="bg-white rounded-[4rem] p-16 md:p-24 border border-slate-100 shadow-sm text-center space-y-12">
                <div className="max-w-sm mx-auto space-y-8">
                    <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center text-6xl mx-auto shadow-inner transform -rotate-6">
                        📦
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">No Products Yet.</h2>
                        <p className="text-slate-400 font-bold text-lg leading-relaxed">
                            Your inventory is currently empty. Ready to start selling?
                        </p>
                    </div>

                    <Link href="/seller/mystore/add-product" className="inline-block pt-4">
                        <Button className="h-16 px-12 rounded-[2rem] bg-blue-600 text-white font-black text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100 border-none group">
                            <span className="flex items-center gap-4">
                                Post First Listing
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="translate-x-0 group-hover:translate-x-1 transition-transform font-black"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                            </span>
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="border-2 border-slate-200 rounded-[3rem] overflow-hidden bg-slate-50/20 shadow-2xl shadow-slate-100/50 min-h-[70vh] p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {products.map((product) => (
                    <div
                        key={product._id}
                        onClick={() => router.push(`/products/${product._id}`)}
                        className="group bg-white border border-slate-200 rounded-[2rem] overflow-hidden hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 cursor-pointer p-4"
                    >
                        <div className="flex gap-5 items-center">
                            {/* Compact Side Image */}
                            <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden shrink-0 relative border border-slate-100 shadow-inner group-hover:shadow-md transition-all">
                                {product.images?.[0] ? (
                                    <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                                )}
                            </div>

                            {/* Compact Info & Actions Content */}
                            <div className="flex-1 flex flex-col justify-between min-w-0 h-24 py-1">
                                <div className="space-y-0.5 min-w-0">
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="flex flex-col min-w-0">
                                            <h3 className="text-[15px] font-black text-slate-900 tracking-tight line-clamp-1 italic uppercase group-hover:text-blue-600 transition-colors leading-tight">{product.title}</h3>
                                            <div className="flex items-center gap-3 mt-0.5">
                                                <p className="text-base font-black text-blue-600 tracking-tight">{product.price.toLocaleString()} <span className="text-[9px] opacity-70">ETB</span></p>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">• Qty: {product.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5 shrink-0 pt-1">
                                            <span className={`w-2 h-2 rounded-full border-2 border-white shadow-sm ${product.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                            {product.isUrgent && (
                                                <span className="bg-red-600 text-white text-[6px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-lg shadow-red-100 animate-pulse">Urgent</span>
                                            )}
                                            {product.isFeatured && (
                                                <span className="bg-amber-500 text-white text-[6px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-lg shadow-amber-100 animate-pulse">Hot</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-auto">
                                    {product.status === 'sold' ? (
                                        <div className="bg-rose-600 text-white text-[9px] font-black uppercase tracking-widest px-4 h-8 rounded-xl flex items-center shadow-lg shadow-rose-100">
                                            Sold
                                        </div>
                                    ) : (
                                        <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMarkAsSold(product._id); }}
                                            disabled={loading === product._id || !subscriptionFeatures?.canMarkAsSold}
                                            className={`text-[9px] font-black uppercase tracking-widest px-4 h-8 rounded-xl transition-all border-none shrink-0 ${subscriptionFeatures?.canMarkAsSold
                                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-50'
                                                : 'bg-slate-100 text-slate-300 cursor-not-allowed grayscale'
                                                }`}
                                        >
                                            {loading === product._id ? '..' : 'Mark Sold'}
                                        </button>
                                    )}

                                    <Link
                                        href={`/seller/mystore/edit-product/${product._id}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="shrink-0"
                                    >
                                        <button className="text-[9px] font-black uppercase tracking-widest px-4 h-8 rounded-xl border border-slate-200 hover:border-slate-900 transition-all text-slate-900 bg-white">
                                            Edit
                                        </button>
                                    </Link>

                                    {/* Urgent Toggle - Pro/Enterprise Only */}
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggleUrgent(product._id); }}
                                        disabled={loading === product._id || !subscriptionFeatures?.canMarkAsUrgent}
                                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all border shrink-0 ${product.isUrgent
                                            ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-100'
                                            : subscriptionFeatures?.canMarkAsUrgent
                                                ? 'bg-white border-slate-200 text-slate-400 hover:border-red-500 hover:text-red-500'
                                                : 'bg-slate-50 border-slate-100 text-slate-200 cursor-not-allowed'
                                            }`}
                                        title={product.isUrgent ? 'Mark as Not Urgent' : 'Mark as Urgent'}
                                    >
                                        {loading === product._id ? (
                                            <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Zap size={14} fill={product.isUrgent ? "currentColor" : "none"} strokeWidth={3} />
                                        )}
                                    </button>

                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(product._id); }}
                                        disabled={loading === product._id}
                                        className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all border-none ml-auto"
                                        title="Delete"
                                    >
                                        {loading === product._id ? '..' : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
