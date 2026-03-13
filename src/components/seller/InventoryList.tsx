"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface InventoryListProps {
    initialProducts: any[];
    storeId: string;
    subscriptionFeatures: any;
}

export default function InventoryList({ initialProducts, storeId, subscriptionFeatures }: InventoryListProps) {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {products.map((product) => (
                <div key={product._id} className="group">
                    <Card className="p-3 rounded-[2rem] border-slate-100 bg-white shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border">
                        <div className="flex gap-4 items-center h-full">
                            {/* Compact Image */}
                            <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden shrink-0 relative border border-slate-100 shadow-inner">
                                {product.images?.[0] ? (
                                    <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                                )}

                                {product.status === 'sold' && (
                                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center">
                                        <span className="text-white font-black text-[7px] uppercase tracking-widest border-2 border-white px-2 py-0.5 rounded-full">Sold</span>
                                    </div>
                                )}
                            </div>

                            {/* Info & Actions Area */}
                            <div className="flex-1 flex flex-col justify-between min-w-0 h-24 py-0.5">
                                <div className="space-y-0.5 min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex flex-col min-w-0">
                                            <h3 className="text-[13px] font-black text-slate-900 tracking-tight line-clamp-1 italic uppercase">{product.title}</h3>
                                            <div className="flex items-center gap-2">
                                                <p className="text-blue-600 font-black text-sm tracking-tight">{product.price.toLocaleString()} <span className="text-[8px] opacity-70">ETB</span></p>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">• QTY: {product.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                            <span className={`w-1.5 h-1.5 rounded-full ${product.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                            {product.isFeatured && (
                                                <span className="bg-amber-500 text-white text-[6px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full shadow-sm">Hot</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 mt-auto overflow-x-auto no-scrollbar">
                                    {product.status !== 'sold' && (
                                        <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMarkAsSold(product._id); }}
                                            disabled={loading === product._id || !subscriptionFeatures?.canMarkAsSold}
                                            className={`text-[8px] font-black uppercase tracking-widest px-2.5 h-7 rounded-lg transition-all border-none shrink-0 ${subscriptionFeatures?.canMarkAsSold
                                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                                                : 'bg-slate-100 text-slate-300 cursor-not-allowed grayscale'
                                                }`}
                                        >
                                            {loading === product._id ? '..' : 'Sold'}
                                        </button>
                                    )}
                                    <Link href={`/seller/mystore/edit-product/${product._id}`} onClick={(e) => e.stopPropagation()} className="shrink-0">
                                        <button className="text-[8px] font-black uppercase tracking-widest px-2.5 h-7 rounded-lg border border-slate-200 hover:border-slate-900 transition-all text-slate-900 bg-white">
                                            Edit
                                        </button>
                                    </Link>
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(product._id); }}
                                        disabled={loading === product._id}
                                        className="text-[8px] font-black uppercase tracking-widest px-2 h-7 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shrink-0 ml-auto"
                                    >
                                        {loading === product._id ? '..' : 'Del'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            ))}
        </div>
    );
}
