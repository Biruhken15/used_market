"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { createStoreAction } from "@/lib/actions/store-actions";

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
        city: "Addis Ababa",
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
                    details: `The file "${file.name}" exceeds the 5MB limit. Please upload a smaller image.`
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
                        // Append each category separately or as a stringified array
                        // Server Actions handle arrays in FormData if passed correctly
                        value.forEach(cat => data.append(key, cat));
                    } else {
                        data.append(key, value as any);
                    }
                }
            });

            if (formData.category.length === 0) {
                setError({ message: "Category Required", details: "Please select at least one business category." });
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

            // Detailed Success Flow: Wait 3 seconds then redirect
            setTimeout(() => {
                router.push("/seller/mystore");
                router.refresh();
            }, 3000);
        } catch (err: any) {
            setError({ message: "An unexpected error occurred", details: err.message });
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative space-y-16">
            {/* Success Overlay Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="bg-white rounded-[3rem] p-10 md:p-16 max-w-xl w-full shadow-2xl border border-slate-100 text-center space-y-8 animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center text-5xl mx-auto shadow-2xl shadow-blue-200 animate-bounce">
                            ✓
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
                                Store Protocol <br />
                                <span className="text-blue-600">Successfully Initialized.</span>
                            </h2>
                            <p className="text-slate-500 font-bold text-lg leading-relaxed">
                                Welcome, <span className="text-slate-900">{createdStoreName}</span>. Your digital storefront is now live on Ethio Market.
                            </p>
                        </div>
                        <div className="pt-4">
                            <div className="flex items-center justify-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Synchronizing Dashboard...
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-5 h-5 flex items-center justify-center bg-red-500 rounded-full">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h3 className="text-red-800 font-black uppercase text-xs tracking-widest">{error.message}</h3>
                    </div>
                    {error.details && (
                        <p className="text-red-600/80 text-sm font-semibold ml-8 leading-relaxed italic">
                            {error.details}
                        </p>
                    )}
                </div>
            )}

            <div className="space-y-16">
                {/* Media Section - Store Branding */}
                <div className="bg-slate-50/50 p-6 md:p-8 border border-slate-200 rounded-3xl relative overflow-hidden">
                    <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                        <span className="w-8 h-8 bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold rounded-lg border border-slate-200">01</span>
                        Store Branding
                    </h3>

                    <div className="space-y-12">
                        {/* Cover Image Upload */}
                        <div className="space-y-4">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Cover Image</label>
                            <div className="relative h-48 w-full bg-white border border-slate-200 rounded-2xl overflow-hidden group">
                                {previews.cover ? (
                                    <img src={previews.cover} alt="Cover Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                        <div className="mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                                        </div>
                                        <p className="font-black text-xs uppercase tracking-widest">Select Store Cover</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    name="coverImage"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, "coverImage")}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
                            </div>
                        </div>

                        {/* Logo Upload */}
                        <div className="flex flex-col md:flex-row gap-10 items-center">
                            <div className="relative w-32 h-32 bg-white border border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 group">
                                {previews.logo ? (
                                    <img src={previews.logo} alt="Logo Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
                                )}
                                <input
                                    type="file"
                                    name="logo"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, "logo")}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="space-y-1">
                                    <h4 className="text-lg font-black text-slate-900 tracking-tight">Business Logo</h4>
                                    <p className="text-slate-500 text-sm font-bold leading-relaxed">Official iconography for brand identification across Ethio Market.</p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <div className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">Validated Format</div>
                                    <div className="px-4 py-1.5 bg-white text-slate-900 border-2 border-slate-900 text-[10px] font-black uppercase tracking-widest">High-Res Only</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Identity Section */}
                <div className="space-y-8">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                        <span className="w-8 h-8 bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold rounded-lg border border-blue-100">02</span>
                        Store Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Store Name</label>
                            <Input
                                required
                                name="storeName"
                                placeholder="e.g. ADDIS LUXURY ITEMS"
                                value={formData.storeName}
                                onChange={handleNameChange}
                                className="h-12 rounded-xl border-slate-200 bg-slate-50/50 px-4 font-semibold text-slate-900 placeholder:text-slate-300 focus:bg-white transition-all ring-0 focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Store Landing URL</label>
                            <div className="relative">
                                <Input
                                    required
                                    name="storeSlug"
                                    placeholder="addis-luxury"
                                    value={formData.storeSlug}
                                    onChange={handleSlugChange}
                                    className="h-12 rounded-xl border-slate-200 bg-slate-50/50 px-4 font-mono font-bold text-blue-600 placeholder:text-slate-300 focus:bg-white transition-all ring-0 focus:ring-2 focus:ring-blue-500/20 pr-20"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 select-none uppercase">.MARKET</div>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Business Categories (Select all that apply)</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
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
                                            className={`px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border-2 ${isSelected
                                                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100 scale-[1.02]"
                                                : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Public Description</label>
                            <textarea
                                required
                                name="description"
                                placeholder="Specify your business offerings and operational standards..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full min-h-[120px] p-4 rounded-xl border border-slate-200 bg-slate-50/50 font-semibold text-slate-900 placeholder:text-slate-300 outline-none focus:bg-white transition-all resize-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="space-y-8">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                        <span className="w-8 h-8 bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold rounded-lg border border-slate-200">03</span>
                        Entity Verification
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Formal Owner Name</label>
                            <Input
                                required
                                name="sellerName"
                                placeholder="Legal Entity or Full Name"
                                value={formData.sellerName}
                                onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                                className="h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 font-semibold text-slate-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Active Phone Number</label>
                            <Input
                                required
                                name="phone"
                                placeholder="+251 911 ..."
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 font-mono font-bold text-slate-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">WhatsApp</label>
                            <Input
                                name="whatsapp"
                                placeholder="+251 ..."
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                className="h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 font-mono font-bold text-slate-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Telegram Handle</label>
                            <Input
                                name="telegram"
                                placeholder="@username"
                                value={formData.telegram}
                                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                                className="h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 font-mono font-bold text-slate-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address</label>
                            <Input
                                required
                                type="email"
                                name="email"
                                placeholder="business@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 font-semibold text-slate-900"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Business Address</label>
                            <Input
                                required
                                name="address"
                                placeholder="Sub-city / Suite / Street Address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 font-semibold text-slate-900"
                            />
                        </div>
                    </div>
                </div>

                {/* ID Verification Section */}
                <div className="space-y-8">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                        <span className="w-8 h-8 bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold rounded-lg border border-slate-200">04</span>
                        Identity Verification
                    </h3>

                    <div className="space-y-10">
                        <div className="space-y-2 max-w-md">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Document Type</label>
                            <select
                                name="idType"
                                value={formData.idType}
                                onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                                className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 font-semibold text-slate-900 outline-none focus:bg-white transition-all focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="National ID">National ID</option>
                                <option value="Kebele ID">Kebele ID</option>
                                <option value="Driver License">Driver License</option>
                                <option value="Passport">Passport</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* ID Front */}
                            <div className="space-y-4">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">ID Front Side</label>
                                <div className="relative h-48 w-full bg-white border border-slate-200 rounded-2xl overflow-hidden group">
                                    {previews.idFront ? (
                                        <img src={previews.idFront} alt="ID Front Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                            <div className="mb-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /><rect width="14" height="10" x="5" y="11" rx="2" /></svg>
                                            </div>
                                            <p className="font-black text-xs uppercase tracking-widest">Upload ID Front</p>
                                        </div>
                                    )}
                                    <input
                                        required
                                        type="file"
                                        name="idFront"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, "idFront")}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
                                </div>
                            </div>

                            {/* ID Back */}
                            <div className="space-y-4">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">ID Back Side</label>
                                <div className="relative h-48 w-full bg-white border border-slate-200 rounded-2xl overflow-hidden group">
                                    {previews.idBack ? (
                                        <img src={previews.idBack} alt="ID Back Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                            <div className="mb-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /><rect width="14" height="10" x="5" y="11" rx="2" /></svg>
                                            </div>
                                            <p className="font-black text-xs uppercase tracking-widest">Upload ID Back</p>
                                        </div>
                                    )}
                                    <input
                                        required
                                        type="file"
                                        name="idBack"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, "idBack")}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-12 flex justify-center">
                <Button
                    type="submit"
                    disabled={loading}
                    className="!h-14 !px-12 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-accent transition-all active:scale-[0.98] shadow-xl shadow-slate-200 border-none"
                >
                    <span className="relative z-10 flex items-center justify-center gap-4">
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                Initializing...
                            </>
                        ) : (
                            <>
                                Create Store Entity
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                            </>
                        )}
                    </span>
                </Button>
            </div>
        </form>
    );
}
