"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toggleUrgentAction, toggleFeaturedAction } from '@/lib/actions/product-actions';
import { Sparkles, Zap, Star, Search, Trash2, CheckCircle2, Package, Tag } from 'lucide-react';

interface InventoryListProps {
    initialProducts: any[];
    storeId: string;
    subscriptionFeatures: any;
}

export default function InventoryList({ initialProducts, storeId, subscriptionFeatures }: InventoryListProps) {
    const router = useRouter();
    const [products, setProducts] = useState(initialProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'sold'>('all');
    const [loading, setLoading] = useState<string | null>(null);

    const handleMarkAsSold = async (productId: string) => {
        if (!confirm('Mark this item as sold?')) return;
        setLoading(productId);
        try {
            const res = await fetch(`/api/products/${productId}/sold`, { method: 'PATCH' });
            
            let data;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                const text = await res.text();
                throw new Error(text || "Server returned non-JSON response");
            }
            
            if (data.error) throw new Error(data.error);

            setProducts(products.map(p => p._id === productId ? { ...p, status: 'sold' } : p));
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(null);
        }
    };

    const handleDelete = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this listing? It will be permanently removed.')) return;
        setLoading(productId);
        try {
            const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
            
            let data;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                const text = await res.text();
                throw new Error(text || "Server returned non-JSON response");
            }

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

    const handleToggleFeatured = async (productId: string) => {
        setLoading(productId);
        try {
            const result = await toggleFeaturedAction(productId, storeId);
            if (result.error) throw new Error(result.error);

            setProducts(products.map(p => p._id === productId ? { ...p, isFeatured: !p.isFeatured } : p));
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(null);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = 
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            product._id.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = 
            statusFilter === 'all' || 
            (statusFilter === 'active' && product.status === 'active') || 
            (statusFilter === 'sold' && product.status === 'sold');

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8">
            {/* SEARCH & FILTERS HEADER */}
            <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-900" strokeWidth={3} />
                        <input 
                            type="text" 
                            placeholder="Find by name or product ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all placeholder:text-slate-400"
                        />
                    </div>
                    
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 border border-slate-200">
                        {(['all', 'active', 'sold'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-5 h-9 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === status 
                                    ? 'bg-slate-950 text-white shadow-md' 
                                    : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredProducts.map((product) => (
                    <div
                        key={product._id}
                        className="group bg-white border border-slate-200 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-500 p-4 border-2 hover:border-slate-900"
                    >
                        <div className="flex gap-5 items-start">
                            {/* Product Image */}
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-50 rounded-2xl overflow-hidden shrink-0 relative border border-slate-100 shadow-inner">
                                {product.images?.[0] ? (
                                    <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
                                )}
                                <div className="absolute top-2 left-2 flex flex-col gap-1">
                                    {product.isUrgent && (
                                        <div className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-lg" title="Urgent">
                                            <Zap size={10} fill="currentColor" strokeWidth={3} />
                                        </div>
                                    )}
                                    {product.isFeatured && (
                                        <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-lg" title="Featured">
                                            <Star size={10} fill="currentColor" strokeWidth={3} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                <div>
                                    <div className="flex justify-between items-start gap-4 mb-2">
                                        <div className="min-w-0">
                                            <h3 className="text-sm md:text-base font-bold md:font-black text-slate-950 truncate uppercase tracking-tight italic leading-none group-hover:text-blue-600 transition-colors">{product.title}</h3>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 opacity-60">ID: {product._id}</p>
                                        </div>
                                        <div className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${product.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${product.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                            {product.status}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="text-lg font-black text-slate-900 tracking-tight">{product.price.toLocaleString()} <span className="text-[9px] opacity-40 italic">ETB</span></p>
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg">
                                            <Package size={10} className="text-slate-400" />
                                            <span className="text-[9px] font-bold text-slate-500">Qty: {product.quantity}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
                                    {product.status !== 'sold' ? (
                                        <button
                                            onClick={() => handleMarkAsSold(product._id)}
                                            disabled={loading === product._id || !subscriptionFeatures?.canMarkAsSold}
                                            className="h-10 px-4 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl text-[9px] font-bold md:font-black uppercase tracking-widest transition-all flex items-center gap-2"
                                        >
                                            <CheckCircle2 size={12} />
                                            Sold
                                        </button>
                                    ) : (
                                        <div className="h-10 px-4 bg-rose-600 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-rose-100">
                                            Marked Sold
                                        </div>
                                    )}

                                    <Link href={`/seller/mystore/edit-product/${product._id}`} className="shrink-0 leading-[0]">
                                        <button className="h-10 px-4 bg-slate-50 text-slate-500 hover:bg-slate-950 hover:text-white rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all">
                                            Edit
                                        </button>
                                    </Link>

                                    {/* Action Toggles */}
                                    <div className="flex gap-1 ml-auto shrink-0">
                                        <button
                                            onClick={() => handleToggleUrgent(product._id)}
                                            disabled={loading === product._id || !subscriptionFeatures?.canMarkAsUrgent}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${product.isUrgent ? 'bg-red-600 text-white shadow-lg animate-pulse' : 'bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500'}`}
                                            title="Urgent Boost"
                                        >
                                            <Zap size={14} fill={product.isUrgent ? 'currentColor' : 'none'} strokeWidth={3} />
                                        </button>
                                        <button
                                            onClick={() => handleToggleFeatured(product._id)}
                                            disabled={loading === product._id || (subscriptionFeatures?.featuredListingsPerMonth === 0)}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${product.isFeatured ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-500'}`}
                                            title="Feature Listing"
                                        >
                                            <Star size={14} fill={product.isFeatured ? 'currentColor' : 'none'} strokeWidth={3} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            disabled={loading === product._id}
                                            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:bg-red-600 hover:text-white transition-all group/del"
                                            title="Delete permanently"
                                        >
                                            <Trash2 size={14} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                
                {filteredProducts.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No products match your current filtering criteria.</p>
                        <button onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} className="mt-4 text-blue-600 font-black text-[10px] uppercase underline tracking-widest">Clear all filters</button>
                    </div>
                )}
            </div>
        </div>
    );
}
