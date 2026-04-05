"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { createStoreAction } from "@/lib/actions/store-actions";
import { X, Camera, Globe, Phone, Mail, MapPin, CheckCircle, Store, Send, ChevronRight, ChevronLeft, User, IdCard } from "lucide-react";
import { ethiopianRegions } from "@/lib/constants/regions";

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
    "Books & Education",
    "Other"
];

export function StoreForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const planId = searchParams.get('planId');
    
    // Multi-step state
    const [step, setStep] = useState<1 | 2>(1);
    
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
        storeType: "standard" as "standard" | "broker",
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

    const handleNextStep = () => {
        if (!formData.storeName || !formData.storeSlug || !formData.description || formData.category.length === 0 || !formData.city || !formData.region) {
            setError({ message: "Required Fields Missing", details: "Please fill out all Store Information fields and select at least one category before proceeding." });
            return;
        }
        setError(null);
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrevStep = () => {
        setError(null);
        setStep(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (step === 1) {
            handleNextStep();
            return;
        }

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
                if (planId) {
                    router.push(`/seller/checkout?planId=${planId}`);
                } else {
                    router.push("/seller/mystore");
                }
                router.refresh();
            }, 3000);
        } catch (err: any) {
            setError({ message: "Unexpected Error", details: err.message });
            setLoading(false);
        }
    };

    const inputClasses = "w-full bg-transparent border-2 border-slate-400 rounded-md px-4 py-3 font-bold text-slate-950 placeholder:text-slate-600 outline-none focus:border-violet-600 focus:bg-white text-sm";
    const labelClasses = "block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2";

    return (
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto space-y-10 pb-20">
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

            {/* Stepper Header */}
            <div className="flex items-center justify-center gap-4 mb-4">
                <div className={`flex items-center gap-2 px-6 py-2 rounded-full border-2 transition-colors ${step === 1 ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-slate-200 bg-white text-slate-400'}`}>
                    <span className="w-6 h-6 rounded-full bg-current text-white flex items-center justify-center text-[10px] font-bold">1</span>
                    <span className="text-xs font-black uppercase tracking-widest">Store Info</span>
                </div>
                <div className="w-12 h-0.5 bg-slate-200"></div>
                <div className={`flex items-center gap-2 px-6 py-2 rounded-full border-2 transition-colors ${step === 2 ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-slate-200 bg-white text-slate-400'}`}>
                    <span className="w-6 h-6 rounded-full bg-current text-white flex items-center justify-center text-[10px] font-bold">2</span>
                    <span className="text-xs font-black uppercase tracking-widest">Seller Info</span>
                </div>
            </div>

            {error && (
                <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl flex gap-4 items-center animate-in slide-in-from-top-4">
                    <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-100">
                        <X size={20} strokeWidth={3} />
                    </div>
                    <div>
                        <h3 className="text-rose-900 font-black text-xs uppercase tracking-widest">{error.message}</h3>
                        {error.details && <p className="text-rose-600/70 text-[10px] font-bold mt-0.5">{error.details}</p>}
                    </div>
                </div>
            )}

            {/* STEP 1: Store Configuration */}
            {step === 1 && (
                <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
                    
                    {/* Store Identity Selection */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
                                <User size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Store Identity</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select your business model</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, storeType: 'standard' })}
                                className={`p-6 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group hover:border-violet-400 ${
                                    formData.storeType === 'standard' 
                                    ? 'border-violet-600 bg-violet-50/30 ring-4 ring-violet-50' 
                                    : 'border-slate-200 bg-white'
                                }`}
                            >
                                {formData.storeType === 'standard' && (
                                    <div className="absolute top-4 right-4 text-violet-600">
                                        <CheckCircle size={20} />
                                    </div>
                                )}
                                <h4 className="font-black italic uppercase tracking-tighter text-slate-950 mb-1">Standard Store</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed">Direct seller of products and goods to consumers.</p>
                            </button>

                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, storeType: 'broker' })}
                                className={`p-6 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group hover:border-violet-400 ${
                                    formData.storeType === 'broker' 
                                    ? 'border-violet-600 bg-violet-50/30 ring-4 ring-violet-50' 
                                    : 'border-slate-200 bg-white'
                                }`}
                            >
                                {formData.storeType === 'broker' && (
                                    <div className="absolute top-4 right-4 text-violet-600">
                                        <CheckCircle size={20} />
                                    </div>
                                )}
                                <h4 className="font-black italic uppercase tracking-tighter text-slate-950 mb-1">Expert Agent</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed">Commission-based agent managing multiple portfolios.</p>
                            </button>
                        </div>
                    </div>

                    {/* Store Branding */}
                    <div className="space-y-6 pt-8 border-t border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
                                <Camera size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Store Logo & Cover</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand visuals for your store</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <label className={labelClasses}>Identity Logo</label>
                                <div className="relative aspect-square bg-slate-50 border-2 border-dashed border-slate-300 rounded-[2rem] flex items-center justify-center overflow-hidden hover:border-violet-500 hover:bg-violet-50 transition-all group">
                                    {previews.logo ? (
                                        <img src={previews.logo} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center p-4">
                                            <Camera size={24} className="mx-auto text-slate-300 group-hover:text-violet-500 transition-colors mb-2" />
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-violet-600">Upload Icon</p>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "logo")} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-3">
                                <label className={labelClasses}>Store Background</label>
                                <div className="relative aspect-[3/1] md:aspect-auto md:h-full bg-slate-50 border-2 border-dashed border-slate-300 rounded-[2rem] flex items-center justify-center overflow-hidden hover:border-violet-500 hover:bg-violet-50 transition-all group">
                                    {previews.cover ? (
                                        <img src={previews.cover} alt="Cover" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center p-6">
                                            <Store size={28} className="mx-auto text-slate-300 group-hover:text-violet-500 transition-colors mb-2" />
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-violet-600">Configure Landing Visual</p>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "coverImage")} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Store Information */}
                    <div className="space-y-6 pt-8 border-t border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
                                <Globe size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Store Info</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Basic details about your business</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClasses}>Store Name</label>
                                <input required type="text" className={inputClasses} placeholder="e.g. Addis Luxury" value={formData.storeName} onChange={handleNameChange} />
                            </div>

                            <div>
                                <label className={labelClasses}>Store Web Address (URL)</label>
                                <div className="relative">
                                    <input required type="text" className={`${inputClasses} font-mono text-violet-600`} placeholder="addis-luxury" value={formData.storeSlug} onChange={handleSlugChange} />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400">.MARKET</span>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelClasses}>Store Description</label>
                                <textarea required rows={4} className={`${inputClasses} resize-none`} placeholder="Define your store's offerings and standards..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                            </div>

                            <div className="md:col-span-2 space-y-4">
                                <label className={labelClasses}>Store Category (Select relevant)</label>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(cat => {
                                        const isSelected = formData.category.includes(cat);
                                        return (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => {
                                                    const newCats = isSelected ? formData.category.filter(c => c !== cat) : [...formData.category, cat];
                                                    setFormData({ ...formData, category: newCats });
                                                }}
                                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${isSelected ? "border-violet-600 text-violet-700 bg-violet-50" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"}`}
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
                                    <input required type="text" className={inputClasses} placeholder="e.g. Ethiopia" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
                                </div>
                                <div>
                                    <label className={labelClasses}>Region</label>
                                    <select required className={inputClasses} value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })}>
                                        <option value="" disabled>Select Region</option>
                                        {ethiopianRegions.map(region => (
                                            <option key={region} value={region}>{region}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClasses}>City</label>
                                    <input required type="text" className={inputClasses} placeholder="e.g. Addis Ababa" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end">
                        <Button type="button" onClick={handleNextStep} className="h-14 px-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-lg">
                            Next Step
                            <ChevronRight size={18} />
                        </Button>
                    </div>
                </div>
            )}


            {/* STEP 2: Seller Information */}
            {step === 2 && (
                <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
                    
                    {/* Seller Details */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
                                <User size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Seller Info</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">How buyers will contact you</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClasses}>Seller Full Name</label>
                                <input required type="text" className={inputClasses} placeholder="Your legal name" value={formData.sellerName} onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })} />
                            </div>
                            <div>
                                <label className={labelClasses}>Email Address</label>
                                <input required type="email" className={inputClasses} placeholder="mail@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div>
                                <label className={labelClasses}>Phone Number</label>
                                <input required type="text" className={inputClasses} placeholder="+251 ..." value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <div>
                                <label className={labelClasses}>Specific Address</label>
                                <input required type="text" className={inputClasses} placeholder="Sub-city, Suite, Street" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>Whatsapp (Optional)</label>
                                    <input type="text" className={inputClasses} placeholder="+251 ..." value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} />
                                </div>
                                <div>
                                    <label className={labelClasses}>Telegram (Optional)</label>
                                    <input type="text" className={inputClasses} placeholder="@handle" value={formData.telegram} onChange={(e) => setFormData({ ...formData, telegram: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ID Verification */}
                    <div className="space-y-6 pt-8 border-t border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
                                <IdCard size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">ID Verification</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Required for trust & safety</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1">
                                <label className={labelClasses}>Document Type</label>
                                <select required className={inputClasses} value={formData.idType} onChange={(e) => setFormData({ ...formData, idType: e.target.value })}>
                                    <option>National ID</option>
                                    <option>Kebele ID</option>
                                    <option>Driver License</option>
                                    <option>Passport</option>
                                </select>
                            </div>
                            
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className={labelClasses}>Document Front Side</label>
                                    <div className="relative aspect-[3/2] bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center overflow-hidden hover:border-violet-500 hover:bg-violet-50 transition-all group">
                                        {previews.idFront ? (
                                            <img src={previews.idFront} alt="ID Front" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center p-4">
                                                <Camera size={24} className="mx-auto text-slate-300 group-hover:text-violet-500 transition-colors mb-2" />
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-violet-600">Upload Front</p>
                                            </div>
                                        )}
                                        <input required type="file" accept="image/*" onChange={(e) => handleFileChange(e, "idFront")} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className={labelClasses}>Document Back Side</label>
                                    <div className="relative aspect-[3/2] bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center overflow-hidden hover:border-violet-500 hover:bg-violet-50 transition-all group">
                                        {previews.idBack ? (
                                            <img src={previews.idBack} alt="ID Back" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center p-4">
                                                <Camera size={24} className="mx-auto text-slate-300 group-hover:text-violet-500 transition-colors mb-2" />
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-violet-600">Upload Back</p>
                                            </div>
                                        )}
                                        <input required type="file" accept="image/*" onChange={(e) => handleFileChange(e, "idBack")} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 flex justify-between items-center sticky bottom-8 z-30">
                        <Button type="button" variant="outline" onClick={handlePrevStep} className="h-14 px-8 rounded-xl border-2 border-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50">
                            <ChevronLeft size={18} />
                            Back
                        </Button>

                        <Button type="submit" disabled={loading} className="h-14 px-8 lg:px-12 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-black text-xs uppercase tracking-[0.2em] hover:brightness-110 transition-all active:scale-95 shadow-xl shadow-indigo-100 flex items-center gap-3 border-none">
                            {loading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                <>
                                    Create Store
                                    <Send size={18} />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </form>
    );
}
