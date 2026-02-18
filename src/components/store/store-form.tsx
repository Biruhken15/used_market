"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const categories = ["Electronics", "Fashion", "Home & Garden", "Vehicles", "Real Estate", "Jobs", "Services"];

export function StoreForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [previews, setPreviews] = useState({ logo: "", cover: "" });
    const [slugModified, setSlugModified] = useState(false);
    const [formData, setFormData] = useState({
        storeName: "",
        storeSlug: "",
        description: "",
        category: "Electronics",
        phone: "",
        whatsapp: "",
        telegram: "",
        address: "",
        sellerName: "",
        city: "Addis Ababa",
        country: "Ethiopia",
        logo: null as File | null,
        coverImage: null as File | null
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "logo" | "coverImage") => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, [field]: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [field === "logo" ? "logo" : "cover"]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null) data.append(key, value as any);
            });

            const res = await fetch("/api/stores", {
                method: "POST",
                body: data
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || "Failed to create store");
            }

            router.push("/dashboard?storeCreated=true");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-16">
            {error && (
                <div className="p-5 bg-red-50 border-4 border-red-500 text-red-600 font-bold text-sm flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                    {error}
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
                                    placeholder="addis-luxury"
                                    value={formData.storeSlug}
                                    onChange={handleSlugChange}
                                    className="h-12 rounded-xl border-slate-200 bg-slate-50/50 px-4 font-mono font-bold text-blue-600 placeholder:text-slate-300 focus:bg-white transition-all ring-0 focus:ring-2 focus:ring-blue-500/20 pr-20"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 select-none uppercase">.MARKET</div>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Business Category</label>
                            <div className="relative">
                                <select
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 font-semibold text-slate-900 appearance-none outline-none focus:bg-white transition-all focus:ring-2 focus:ring-blue-500/20"
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6" /></svg>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Public Description</label>
                            <textarea
                                required
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
                                placeholder="+251 911 ..."
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 font-mono font-bold text-slate-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">WhatsApp</label>
                            <Input
                                placeholder="+251 ..."
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                className="h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 font-mono font-bold text-slate-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Telegram Handle</label>
                            <Input
                                placeholder="@username"
                                value={formData.telegram}
                                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                                className="h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 font-mono font-bold text-slate-900"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Business Address</label>
                            <Input
                                required
                                placeholder="Sub-city / Suite / Street Address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="h-12 rounded-xl border-slate-200 bg-slate-50/50 px-4 font-semibold text-slate-900"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-12">
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 rounded-2xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/10"
                >
                    <span className="relative z-10 flex items-center justify-center gap-4">
                        {loading ? (
                            <>
                                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                INITIALIZING SYSTEM...
                            </>
                        ) : (
                            <>
                                CREATE STORE ENTITY
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="translate-x-1"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                            </>
                        )}
                    </span>
                </Button>
            </div>
        </form>
    );
}
