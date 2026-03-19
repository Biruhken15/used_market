"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { createStoreAction } from "@/lib/actions/store-actions";
import { X, Camera, Globe, Phone, Mail, MapPin, CheckCircle, Store, Send, ChevronRight, User } from "lucide-react";
import { ethiopianRegions } from "@/lib/constants/regions";

const categories = ["Electronics", "Phones", "Real Estate", "Vehicles", "Houses", "Furniture", "Fashion", "Sports", "Books", "Other"];

export function StoreForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ message: string; details?: string } | null>(null);
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const [showSuccess, setShowSuccess] = useState(false);
    const [createdStoreName, setCreatedStoreName] = useState("");
    const [previews, setPreviews] = useState({ logo: "", cover: "", idFront: "", idBack: "" });
    const [slugModified, setSlugModified] = useState(false);

    const [formData, setFormData] = useState({
        storeName: "",
        storeSlug: "",
        description: "",
        category: [] as string[],
        phone: "",
        whatsapp: "",
        telegram: "",
        address: "",
        email: "",
        sellerName: "",
        city: "",
        region: "",
        country: "Ethiopia",
        idType: "National ID",
        logo: null as File | null,
        coverImage: null as File | null,
        idFront: null as File | null,
        idBack: null as File | null
    });

    const slugifyLocal = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
            .replace(/--+/g, "-");
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData(prev => ({
            ...prev,
            storeName: name,
            storeSlug: slugModified ? prev.storeSlug : slugifyLocal(name)
        }));
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlugModified(true);
        setFormData({ ...formData, storeSlug: slugifyLocal(e.target.value) });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "logo" | "coverImage" | "idFront" | "idBack") => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                setError({
                    message: "File Too Large",
                    details: `The file "${file.name}" exceeds the 5MB limit.`
                });
                return;
            }
            setError(null);
            setFormData({ ...formData, [field]: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                let previewKey: keyof typeof previews = "logo";
                if (field === "coverImage") previewKey = "cover";
                if (field === "idFront") previewKey = "idFront";
                if (field === "idBack") previewKey = "idBack";
                setPreviews(prev => ({ ...prev, [previewKey]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null) {
                    if (key === 'category' && Array.isArray(value)) {
                        value.forEach(cat => data.append(key, cat));
                    } else {
                        data.append(key, value as any);
                    }
                }
            });

            if (formData.category.length === 0) {
                setError({ message: "Category Required", details: "Please select at least one category." });
                setLoading(false);
                return;
            }

            const result = await createStoreAction(data);

            if (result.error) {
                setError({ message: result.error, details: result.details });
                setLoading(false);
                return;
            }

            setCreatedStoreName(formData.storeName);
            setShowSuccess(true);
            setLoading(false);

            setTimeout(() => {
                router.push("/seller/mystore");
                router.refresh();
            }, 3000);
        } catch (err: any) {
            setError({ message: "Unexpected Error", details: err.message });
            setLoading(false);
        }
    };

    const inputClasses = "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 placeholder:text-slate-300 outline-none focus:border-slate-900 transition-all shadow-sm text-sm";
    const labelClasses = "block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2";

    return (
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto space-y-12 pb-20">
            {/* Success Overlay */}
            {showSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="bg-white rounded-[3rem] p-10 md:p-14 max-w-lg w-full shadow-2xl border border-slate-100 text-center space-y-8 animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center text-3xl mx-auto shadow-2xl shadow-emerald-100">
                            ✓
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Protocol Validated</h2>
                            <p className="text-slate-400 font-bold text-sm tracking-wide">
                                <span className="text-slate-900">{createdStoreName}</span> is now active.
                                <br />Prepare for market integration.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl flex gap-4 items-center animate-in slide-in-from-top-4">
                    <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white shrink-0">
                        <X size={20} strokeWidth={3} />
                    </div>
                    <div>
                        <h3 className="text-rose-900 font-black text-xs uppercase tracking-widest">{error.message}</h3>
                        {error.details && <p className="text-rose-600/70 text-[10px] font-bold mt-0.5">{error.details}</p>}
                    </div>
                </div>
            )}

            {/* Section 1: Branding */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Camera size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Store Logo & Cover</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand visuals for your store</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Logo */}
                    <div className="space-y-3">
                        <label className={labelClasses}>Identity Logo</label>
                        <div className="relative aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex items-center justify-center overflow-hidden hover:border-slate-900 transition-all group">
                            {previews.logo ? (
                                <img src={previews.logo} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-4">
                                    <Camera size={24} className="mx-auto text-slate-300 group-hover:text-slate-900 transition-colors mb-2" />
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest group-hover:text-slate-900">Upload Icon</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "logo")}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                        </div>
                    </div>

                    {/* Cover */}
                    <div className="md:col-span-2 space-y-3">
                        <label className={labelClasses}>Store Background Protocol</label>
                        <div className="relative aspect-[3/1] md:aspect-auto md:h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex items-center justify-center overflow-hidden hover:border-slate-900 transition-all group">
                            {previews.cover ? (
                                <img src={previews.cover} alt="Cover" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-6">
                                    <Store size={28} className="mx-auto text-slate-300 group-hover:text-slate-900 transition-colors mb-2" />
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest group-hover:text-slate-900">Configure Landing Visual</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "coverImage")}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Details */}
            <div className="space-y-8 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Globe size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Store information</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your product will be filtered by this</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClasses}>Store Name</label>
                        <input
                            required
                            className={inputClasses}
                            placeholder="e.g. Addis Luxury"
                            value={formData.storeName}
                            onChange={handleNameChange}
                        />
                    </div>

                    <div>
                        <label className={labelClasses}>Store Web Address (URL)</label>
                        <div className="relative">
                            <input
                                required
                                className={`${inputClasses} font-mono text-blue-600`}
                                placeholder="addis-luxury"
                                value={formData.storeSlug}
                                onChange={handleSlugChange}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-300">.MARKET</span>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className={labelClasses}>Store Description</label>
                        <textarea
                            required
                            rows={3}
                            className={`${inputClasses} resize-none h-32`}
                            placeholder="Define your store's offerings and standards..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2 space-y-4">
                        <label className={labelClasses}>Store Category</label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => {
                                const isSelected = formData.category.includes(cat);
                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => {
                                            const newCats = isSelected
                                                ? formData.category.filter(c => c !== cat)
                                                : [...formData.category, cat];
                                            setFormData({ ...formData, category: newCats });
                                        }}
                                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${isSelected
                                            ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                                            : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className={labelClasses}>Country</label>
                            <input
                                required
                                className={inputClasses}
                                placeholder="e.g. Ethiopia"
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Region</label>
                            <select
                                required
                                className={inputClasses}
                                value={formData.region}
                                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                            >
                                <option value="" disabled>Select Region</option>
                                {ethiopianRegions.map(region => (
                                    <option key={region} value={region}>{region}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClasses}>City</label>
                            <input
                                required
                                className={inputClasses}
                                placeholder="e.g. Addis Ababa"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 3: Owner & Verification */}
            <div className="space-y-8 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <User size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Seller information</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">The buyer will contact you with below info</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClasses}>Seller Full Name</label>
                        <input
                            required
                            className={inputClasses}
                            placeholder="Operator Name"
                            value={formData.sellerName}
                            onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className={labelClasses}>Phone Number</label>
                        <input
                            required
                            className={inputClasses}
                            placeholder="+251 ..."
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className={labelClasses}>Email Address</label>
                        <input
                            required
                            type="email"
                            className={inputClasses}
                            placeholder="mail@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className={labelClasses}>Specific Address</label>
                        <input
                            required
                            className={inputClasses}
                            placeholder="Sub-city, Suite, Street"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClasses}>Telegram</label>
                            <input
                                className={inputClasses}
                                placeholder="@handle"
                                value={formData.telegram}
                                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>WhatsApp</label>
                            <input
                                className={inputClasses}
                                placeholder="+251 ..."
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClasses}>ID Verification Type</label>
                        <select
                            className={inputClasses}
                            value={formData.idType}
                            onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                        >
                            <option>National ID</option>
                            <option>Kebele ID</option>
                            <option>Driver License</option>
                            <option>Passport</option>
                        </select>
                    </div>
                </div>

                {/* ID Uploads */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className={labelClasses}>ID Front Matrix</label>
                        <div className="relative aspect-[3/2] bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden hover:border-slate-900 transition-all group">
                            {previews.idFront ? (
                                <img src={previews.idFront} alt="ID Front" className="w-full h-full object-cover" />
                            ) : (
                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Select ID Front</p>
                            )}
                            <input
                                required
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "idFront")}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className={labelClasses}>ID Back Matrix</label>
                        <div className="relative aspect-[3/2] bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden hover:border-slate-900 transition-all group">
                            {previews.idBack ? (
                                <img src={previews.idBack} alt="ID Back" className="w-full h-full object-cover" />
                            ) : (
                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Select ID Back</p>
                            )}
                            <input
                                required
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "idBack")}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-10 flex justify-center sticky bottom-8 z-30">
                <Button
                    type="submit"
                    disabled={loading}
                    className="h-16 px-16 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 transition-all active:scale-95 shadow-2xl shadow-blue-100 flex items-center gap-4 border-none"
                >
                    {loading ? (
                        <>Wait...</>
                    ) : (
                        <>
                            Create Store
                            <Send size={18} />
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
