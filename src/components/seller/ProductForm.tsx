"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createProductAction, updateProductAction } from '@/lib/actions/product-actions';

interface ProductFormProps {
    initialData?: any;
    isEditing?: boolean;
    productId?: string;
    storeId?: string;
    storeSlug?: string;
    planLimits?: {
        maxActiveListings: number;
        imagesPerProduct: number;
    };
}

export default function ProductForm({ initialData, isEditing = false, productId, storeId, storeSlug, planLimits }: ProductFormProps) {
    const router = useRouter();
    // ... rest of the component state ...
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ message: string; details?: string } | null>(null);

    // Media state
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>(initialData?.images?.map((img: any) => img.url) || []);

    // Form state
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        priceType: initialData?.priceType || 'fixed',
        category: initialData?.category || '',
        condition: initialData?.condition || 'good',
        quantity: initialData?.quantity || '1',
        isFeatured: initialData?.isFeatured || false,
    });

    const categories = ['electronics', 'phones', 'real-estate', 'vehicles', 'houses', 'furniture', 'fashion', 'sports', 'books', 'other'];
    const conditions = [
        { value: 'new', label: 'Brand New' },
        { value: 'like-new', label: 'Like New' },
        { value: 'good', label: 'Good condition' },
        { value: 'fair', label: 'Well used' },
        { value: 'for-parts', label: 'For Parts / Repair' }
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const limit = planLimits?.imagesPerProduct || 3;

        if (imageFiles.length + files.length > limit) {
            setError({
                message: "Image Limit Reached",
                details: `Your current plan allows only ${limit} images per product. Please upgrade to add more.`
            });
            return;
        }

        const newFiles = [...imageFiles, ...files];
        setImageFiles(newFiles);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        if (error?.message.includes('images')) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = new FormData();
            data.append("storeId", storeId || "");
            data.append("storeSlug", storeSlug || "");
            if (isEditing && productId) {
                data.append("productId", productId);
            }
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("price", formData.price);
            data.append("priceType", formData.priceType);
            data.append("category", formData.category);
            data.append("condition", formData.condition);
            data.append("quantity", formData.quantity);
            data.append("isFeatured", formData.isFeatured.toString());

            imageFiles.forEach(file => {
                data.append("images", file);
            });

            const result = isEditing
                ? await updateProductAction(data)
                : await createProductAction(data);

            if (result.error) {
                setError({ message: result.error, details: result.details });
                setLoading(false);
                return;
            }

            // Redirect back to inventory mode using client-side router
            router.push('/seller/mystore?success=true');
        } catch (err: any) {
            setError({ message: "An unexpected error occurred", details: err.message });
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-12 max-w-2xl mx-auto pb-12 pt-4">
            {error && (
                <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-2xl shadow-sm">
                    <h3 className="text-red-800 font-black uppercase text-xs tracking-widest leading-none mb-1">{error.message}</h3>
                    {error.details && <p className="text-red-600/80 text-sm font-bold">{error.details}</p>}
                </div>
            )}

            {/* Media Section */}
            <section className="space-y-4">
                <div className="flex justify-between items-end mb-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Product Visuals ({imageFiles.length}/{planLimits?.imagesPerProduct || 3})</label>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline"
                    >
                        Add Media +
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, idx) => (
                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                            </button>
                            {idx === 0 && (
                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-accent text-white text-[8px] font-black uppercase rounded shadow-lg">Primary</div>
                            )}
                        </div>
                    ))}
                    {imageFiles.length < (planLimits?.imagesPerProduct || 3) && (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-accent hover:text-accent transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                            <span className="text-[10px] font-black uppercase tracking-widest">Upload Image</span>
                        </button>
                    )}
                </div>
            </section>

            <section className="space-y-8">
                <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Listing Title</label>
                        <Input
                            placeholder="e.g. iPhone 15 Pro Max - 256GB"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Product Description</label>
                        <textarea
                            placeholder="Describe your item in detail..."
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-2xl p-4 font-bold text-slate-900 placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all resize-none shadow-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Price & Type</label>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    required
                                    placeholder="Amount"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                                <select
                                    value={formData.priceType}
                                    onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                                    className="bg-slate-900 text-white rounded-xl px-4 text-[10px] font-black uppercase tracking-widest outline-none border-none cursor-pointer"
                                >
                                    <option value="fixed">Fixed</option>
                                    <option value="negotiable">Negotiable</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Quantity Available</label>
                            <Input
                                type="number"
                                required
                                min="1"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 font-black text-[11px] uppercase tracking-widest text-slate-900 outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all appearance-none cursor-pointer shadow-sm"
                            >
                                <option value="">Select Domain</option>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Condition</label>
                            <select
                                value={formData.condition}
                                onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 font-black text-[11px] uppercase tracking-widest text-slate-900 outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all appearance-none cursor-pointer shadow-sm"
                            >
                                {conditions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                        </div>

                    </div>

                    {/* Featured Option - Only for Pro/Enterprise */}
                    {(planLimits?.maxActiveListings || 0) > 20 && (
                        <div className="p-6 rounded-[2rem] bg-amber-50 border-2 border-amber-100 flex items-center justify-between group hover:border-amber-400 transition-all">
                            <div className="space-y-1">
                                <h3 className="text-sm font-black text-amber-900 uppercase tracking-widest italic">Featured Listing</h3>
                                <p className="text-[10px] font-bold text-amber-700/60 uppercase tracking-wider">Boost visibility by 25% on homepage</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                                className={`w-14 h-8 rounded-full relative transition-all ${formData.isFeatured ? 'bg-amber-500' : 'bg-slate-200'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.isFeatured ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <div className="pt-6 flex justify-center">
                <Button
                    disabled={loading}
                    className="!h-13 !px-12 rounded-xl bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest hover:bg-accent transition-all border-none"
                >
                    {loading ? (
                        <div className="flex items-center gap-3">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                            Processing...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            {isEditing ? 'Update Listing' : 'Add Product'}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                        </div>
                    )}
                </Button>
            </div>
        </form>
    );
}
