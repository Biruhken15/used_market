"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createProductAction, updateProductAction } from '@/lib/actions/product-actions';
import { X, Bell, Info, AlertTriangle, CheckCircle, Gift, ChevronRight, Sparkles } from 'lucide-react';

interface ProductFormProps {
    initialData?: any;
    productId?: string;
    storeId?: string;
    storeSlug?: string;
    planLimits: {
        maxActiveListings: number;
        imagesPerProduct: number;
        planCode?: string;
        canMarkAsUrgent?: boolean;
        canMarkAsFeatured?: boolean;
        featuredListingsPerMonth?: number;
    };
    product?: any;
    isEditing?: boolean;
    onClose?: () => void;
    closeUrl?: string;
    viewType?: 'inline' | 'drawer';
}

export default function ProductForm({ initialData, isEditing = false, productId, storeId, storeSlug, planLimits, onClose, closeUrl, viewType = 'inline' }: ProductFormProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ message: string; details?: string } | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);


    // Media state
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>(
        Array.isArray(initialData?.images) 
            ? initialData.images.map((img: any) => img.url).filter(Boolean) 
            : []
    );

    // Form state
    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        price: string;
        priceType: 'fixed' | 'negotiable';
        category: string;
        condition: 'new' | 'like-new' | 'good' | 'fair' | 'for-parts';
        quantity: string;
        isFeatured: boolean;
        isUrgent: boolean;
        saleType: 'sale' | 'rent';
        sourceOwner: {
            name: string;
            phone: string;
            telegram: string;
            address: string;
            otherInfo: string;
        };
        region: string;
    }>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        priceType: initialData?.priceType || 'fixed',
        category: initialData?.category || '',
        condition: initialData?.condition || 'good',
        quantity: initialData?.quantity || '1',
        isFeatured: initialData?.isFeatured || false,
        isUrgent: initialData?.isUrgent || false,
        saleType: initialData?.saleType || 'sale',
        sourceOwner: {
            name: initialData?.sourceOwner?.name || '',
            phone: initialData?.sourceOwner?.phone || '',
            telegram: initialData?.sourceOwner?.telegram || '',
            address: initialData?.sourceOwner?.address || '',
            otherInfo: initialData?.sourceOwner?.otherInfo || '',
        },
        region: initialData?.region || '',
    });

    const categories = [
        "Real Estate & Property",
        "Vehicles & Cars",
        "Phones & Tablets",
        "Computers & Laptops",
        "Home Appliances",
        "Electronics",
        "Furniture & Decor",
        "Construction & Materials",
        "Heavy Machinery & Equipment",
        "Office & Business",
        "Fashion & Wearables",
        "Sports & Outdoors",
        "Health & Beauty",
        "Books & Education",
        "Services",
        "Other"
    ];
    const conditions = [
        { value: 'new', label: 'New' },
        { value: 'like-new', label: 'Like New' },
        { value: 'good', label: 'Good' },
        { value: 'fair', label: 'Fair' },
        { value: 'for-parts', label: 'For Parts' }
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const limit = planLimits?.imagesPerProduct || 3;
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file

        if (imageFiles.length + files.length > limit) {
            setError({
                message: "Image Limit Reached",
                details: `Your current plan allows only ${limit} images per product.`
            });
            return;
        }

        // Validate file size for each image
        for (const file of files) {
            if (file.size > MAX_FILE_SIZE) {
                setError({
                    message: "File Too Large",
                    details: `The image "${file.name}" is over 10MB. Please use a compressed or lower-resolution photo, especially on mobile devices.`
                });
                return;
            }
        }
        
        setError(null);

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
    };

    const handleClose = () => {
        if (onClose) onClose();
        if (closeUrl) {
            router.push(closeUrl);
        } else {
            router.back();
        }
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
            data.append("isUrgent", formData.isUrgent.toString());
            data.append("region", formData.region);
            data.append("saleType", formData.saleType);

            data.append("sourceOwnerName", formData.sourceOwner.name);
            data.append("sourceOwnerPhone", formData.sourceOwner.phone);
            data.append("sourceOwnerTelegram", formData.sourceOwner.telegram);
            data.append("sourceOwnerAddress", formData.sourceOwner.address);
            data.append("sourceOwnerOtherInfo", formData.sourceOwner.otherInfo);

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

            setShowSuccess(true);
            setLoading(false);

            // Close after a short delay to show success
            setTimeout(() => {
                handleClose();
                // Optional: short delay for refresh
                router.refresh();
            }, 2000);

        } catch (err: any) {
            setError({ message: "An error occurred", details: err.message });
            setLoading(false);
        }
    };

    const inputClasses = "w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 font-medium text-slate-900 placeholder:text-slate-300 outline-none focus:border-slate-900 transition-all shadow-sm";
    const labelClasses = "block text-sm font-bold text-slate-700 mb-1.5";

    const FormContent = (
        <form onSubmit={handleSubmit} className="space-y-8 pb-10">
            {showSuccess && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-white/90 backdrop-blur-sm animate-in fade-in duration-500 rounded-[2.5rem]">
                    <div className="text-center space-y-4 animate-in zoom-in-95 duration-500">
                        <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-xl shadow-emerald-100">
                            ✓
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">Success</h2>
                            <p className="text-slate-400 font-bold text-[10px] tracking-wide uppercase">
                                Product {isEditing ? 'updated' : 'added'} successfully.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="p-4 bg-violet-50 border border-violet-100 rounded-xl">
                    <h3 className="text-violet-600 font-black text-xs uppercase tracking-widest">{error.message}</h3>
                    {error.details && <p className="text-violet-600/60 text-[10px] font-bold mt-1">{error.details}</p>}
                </div>
            )}

            {/* 1. Item Visuals & Details */}
            <div className="space-y-8 bg-slate-50/30 p-6 rounded-[2rem] border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm shadow-sm border border-slate-100">1</div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest italic">Item Essentials</h3>
                </div>

                <div className="space-y-6">
                    {/* Media Section */}
                    <div className="space-y-4">
                        <label className={labelClasses}>Product Photos ({imageFiles.length}/{planLimits?.imagesPerProduct || 3})</label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {imagePreviews.map((preview, idx) => (
                                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group">
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 w-5 h-5 bg-slate-900/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={10} strokeWidth={3} />
                                    </button>
                                </div>
                            ))}
                            {imageFiles.length < (planLimits?.imagesPerProduct || 3) && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:border-slate-900 hover:text-slate-900 transition-all bg-white shadow-inner"
                                >
                                    <Sparkles size={20} className="opacity-20" />
                                </button>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className={labelClasses}>Item Name</label>
                            <input
                                className={inputClasses}
                                placeholder="What are you selling?"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className={labelClasses}>Description</label>
                            <textarea
                                className="w-full bg-white border border-slate-300 rounded-lg p-4 font-medium text-slate-900 placeholder:text-slate-300 outline-none focus:border-slate-900 transition-all resize-none shadow-sm text-sm"
                                placeholder="Tell buyers more about it..."
                                required
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className={labelClasses}>Listing Type</label>
                                <select
                                    value={formData.saleType}
                                    onChange={(e) => setFormData({ ...formData, saleType: e.target.value as any })}
                                    className={inputClasses}
                                >
                                    <option value="sale">For Sale</option>
                                    <option value="rent">For Rent</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Price (ETB)</label>
                                <input
                                    type="number"
                                    required
                                    className={inputClasses}
                                    placeholder="Amount"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Price Type</label>
                                <select
                                    value={formData.priceType}
                                    onChange={(e) => setFormData({ ...formData, priceType: e.target.value as any })}
                                    className={inputClasses}
                                >
                                    <option value="fixed">Fixed</option>
                                    <option value="negotiable">Deal</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>Category</label>
                                <select
                                    required
                                    className={inputClasses}
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="">Choose Area</option>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Condition</label>
                                <select
                                    className={inputClasses}
                                    value={formData.condition}
                                    onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                                >
                                    {conditions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>Region / Market Area</label>
                            <select
                                required
                                className={inputClasses}
                                value={formData.region}
                                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                            >
                                <option value="">Choose Area</option>
                                <option value="Addis Ababa">Addis Ababa</option>
                                <option value="Afar">Afar</option>
                                <option value="Amhara">Amhara</option>
                                <option value="Benishangul-Gumuz">Benishangul-Gumuz</option>
                                <option value="Central Ethiopia">Central Ethiopia</option>
                                <option value="Dire Dawa">Dire Dawa</option>
                                <option value="Gambela">Gambela</option>
                                <option value="Harari">Harari</option>
                                <option value="Oromia">Oromia</option>
                                <option value="Sidama">Sidama</option>
                                <option value="Somali">Somali</option>
                                <option value="South Ethiopia">South Ethiopia</option>
                                <option value="South West Ethiopia">South West Ethiopia</option>
                                <option value="Tigray">Tigray</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Premium Listing Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Featured Toggle */}
                    {planLimits?.canMarkAsFeatured && (
                        <label className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${formData.isFeatured ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'}`}>
                            <input
                                type="checkbox"
                                className="w-5 h-5 accent-emerald-600 rounded"
                                checked={formData.isFeatured}
                                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                            />
                            <div className="flex-1">
                                <p className="text-[11px] font-black text-emerald-900 uppercase tracking-widest leading-none">Featured Slot ⭐</p>
                                <p className="text-[9px] font-bold text-emerald-900/60 leading-tight">Featured carousels & rankings</p>
                            </div>
                        </label>
                    )}

                    {/* Urgent Toggle - Pro/Enterprise Only */}
                    {planLimits?.canMarkAsUrgent && (
                        <label className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${formData.isUrgent ? 'bg-red-50 border-red-200' : 'bg-white border-slate-100'}`}>
                            <input
                                type="checkbox"
                                className="w-5 h-5 accent-red-600 rounded"
                                checked={formData.isUrgent}
                                onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                            />
                            <div className="flex-1">
                                <p className="text-[11px] font-black text-red-900 uppercase tracking-widest leading-none">Urgent Listing ⚡</p>
                                <p className="text-[9px] font-bold text-red-900/60 leading-tight">Flame badge & top placement</p>
                            </div>
                        </label>
                    )}
                </div>
            </div>

            {/* 2. Broker / Owner Information Area */}
            <div className="space-y-8 bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm shadow-sm border border-blue-100">2</div>
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest italic">Product Owner Info</h3>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-widest border border-slate-100">Optional</span>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className={labelClasses}>Source Identity</label>
                        <input
                            className={inputClasses}
                            placeholder="Owner Name"
                            value={formData.sourceOwner.name}
                            onChange={(e) => setFormData({ ...formData, sourceOwner: { ...formData.sourceOwner, name: e.target.value } })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClasses}>Phone Protocol</label>
                            <input
                                className={inputClasses}
                                placeholder="Number"
                                value={formData.sourceOwner.phone}
                                onChange={(e) => setFormData({ ...formData, sourceOwner: { ...formData.sourceOwner, phone: e.target.value } })}
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Telegram</label>
                            <input
                                className={inputClasses}
                                placeholder="@handle"
                                value={formData.sourceOwner.telegram}
                                onChange={(e) => setFormData({ ...formData, sourceOwner: { ...formData.sourceOwner, telegram: e.target.value } })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClasses}>Physical Address</label>
                        <input
                            className={inputClasses}
                            placeholder="Location / Neighborhood"
                            value={formData.sourceOwner.address}
                            onChange={(e) => setFormData({ ...formData, sourceOwner: { ...formData.sourceOwner, address: e.target.value } })}
                        />
                    </div>

                    <div>
                        <label className={labelClasses}>Special Notice (Notes)</label>
                        <textarea
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 font-medium text-slate-900 placeholder:text-slate-300 outline-none focus:border-slate-900 transition-all resize-none text-sm"
                            placeholder="Any private notes about this source..."
                            rows={2}
                            value={formData.sourceOwner.otherInfo}
                            onChange={(e) => setFormData({ ...formData, sourceOwner: { ...formData.sourceOwner, otherInfo: e.target.value } })}
                        />
                    </div>
                </div>
            </div>


            <div className="pt-6">
                <Button
                    disabled={loading || showSuccess}
                    className="h-14 w-full rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:brightness-110 shadow-xl shadow-indigo-100 transition-all active:scale-95 border-none"
                >
                    {loading ? 'Wait...' : showSuccess ? 'Success!' : (isEditing ? 'Update Product' : 'Add Product')}
                </Button>
            </div>
        </form>
    );

    if (viewType === 'drawer') {
        return (
            <div className="fixed inset-0 sm:top-[10%] sm:right-6 sm:bottom-6 sm:left-auto sm:w-full sm:max-w-[440px] bg-white z-[200] shadow-2xl flex flex-col sm:rounded-[3rem] animate-in fade-in slide-in-from-bottom-12 duration-500 overflow-hidden">
                {/* Independent Scroll Container */}
                <div className="flex-1 overflow-y-auto px-6 sm:px-8 pt-8 relative scrollbar-hide">
                    {/* Floating Header */}
                    <div className="flex items-center justify-between mb-8 sticky top-0 bg-white/90 backdrop-blur-md pt-2 pb-4 z-20 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                                <ChevronRight size={18} strokeWidth={3} />
                            </div>
                            <h2 className="text-lg font-black text-slate-900 tracking-tight italic uppercase">{isEditing ? 'Edit Item' : 'New Product'}</h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all group"
                            title="Cancel and Close"
                        >
                            <X size={16} strokeWidth={3} className="group-active:scale-90 transition-transform" />
                        </button>
                    </div>

                    {FormContent}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-6 sm:py-12 px-0 sm:px-4 bg-slate-50/30">
            <div className="w-full max-w-2xl bg-white border-none sm:border-4 border-slate-200 sm:rounded-[3rem] p-6 sm:p-10 md:p-14 shadow-2xl shadow-slate-200/50">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">{isEditing ? 'Edit Listing' : 'New Listing'}</h1>
                    <p className="text-slate-400 font-bold text-[10px] tracking-[0.3em] uppercase mt-1">Marketplace Protocol</p>
                </div>
                {FormContent}
            </div>
        </div>
    );
}
