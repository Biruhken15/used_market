"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    updateStoreAction,
    deleteStoreAction,
    addStaffAction,
    removeStaffAction
} from '@/lib/actions/store-actions';
import { useRouter } from 'next/navigation';

interface StoreSettingsProps {
    store: any;
}

const Icons = {
    Store: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" /></svg>
    ),
    Phone: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.81 12.81 0 0 0 .62 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.18-2.18a2 2 0 0 1 2.11-.45 12.81 12.81 0 0 0 2.81.62A2 2 0 0 1 22 16.92z" /></svg>
    ),
    MapPin: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
    ),
    PhoneCall: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.81 12.81 0 0 0 .62 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.18-2.18a2 2 0 0 1 2.11-.45 12.81 12.81 0 0 0 2.81.62A2 2 0 0 1 22 16.92z" /><path d="M14.05 2a9 9 0 0 1 8 7.94" /><path d="M14.05 6A5 5 0 0 1 18 10" /></svg>
    ),
    Send: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
    ),
    Globe: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
    ),
    Save: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
    ),
    ImageIcon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
    ),
    Loader2: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
    ),
    Users: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    ),
    Trash: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
    ),
    AlertTriangle: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
    )
};

type Tab = 'general' | 'contact' | 'staff' | 'danger';

export default function StoreSettings({ store }: StoreSettingsProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('general');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [logoPreview, setLogoPreview] = useState(store.logo?.url || null);
    const [coverPreview, setCoverPreview] = useState(store.coverImage?.url || null);

    // Staff management state
    const [staffEmail, setStaffEmail] = useState('');
    const [staffRole, setStaffRole] = useState('editor');

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            storeName: store.storeName,
            description: store.description,
            phone: store.phone,
            whatsapp: store.whatsapp || '',
            telegram: store.telegram || '',
            address: store.address,
            city: store.city
        }
    });

    const onSubmit = async (data: any) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const formData = new FormData();
            formData.append("storeId", store._id);
            formData.append("storeSlug", store.storeSlug);

            Object.keys(data).forEach(key => {
                formData.append(key, data[key]);
            });

            const logoInput = document.getElementById('logo-upload') as HTMLInputElement;
            const coverInput = document.getElementById('cover-upload') as HTMLInputElement;

            if (logoInput?.files?.[0]) formData.append("logo", logoInput.files[0]);
            if (coverInput?.files?.[0]) formData.append("coverImage", coverInput.files[0]);

            const result = await updateStoreAction(formData);

            if (result.success) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                setError(result.error || "Update failed");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'logo') setLogoPreview(reader.result as string);
                else setCoverPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddStaff = async () => {
        if (!staffEmail) return;
        setLoading(true);
        setError(null);
        try {
            const result = await addStaffAction(store._id, staffEmail, staffRole);
            if (result.success) {
                setStaffEmail('');
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                setError(result.error || "Failed to add staff");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveStaff = async (userId: string) => {
        if (!confirm("Are you sure you want to remove this staff member?")) return;
        setLoading(true);
        try {
            const result = await removeStaffAction(store._id, userId);
            if (result.success) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                setError(result.error || "Failed to remove staff");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteStore = async () => {
        const confirmation = prompt(`Type "${store.storeName}" to confirm store deletion. This action cannot be undone.`);
        if (confirmation !== store.storeName) return;

        setLoading(true);
        try {
            const result = await deleteStoreAction(store._id);
            if (result.success) {
                router.push('/dashboard');
            } else {
                setError(result.error || "Deletion failed");
                setLoading(false);
            }
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const storeUrl = `used.market/stores/${store.storeSlug}`;

    return (
        <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header & Quick Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Settings</h2>
                    <p className="text-slate-500 font-bold mt-1 flex items-center gap-2">
                        Manage your store existence & performance
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <a href={`/stores/${store.storeSlug}`} target="_blank" className="text-blue-600 hover:underline">View Public Store ↗</a>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        disabled={loading}
                        className="bg-slate-900 text-white hover:bg-black px-6 h-12 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-slate-200 border-none transition-all active:scale-95 flex items-center gap-2"
                    >
                        {loading ? <Icons.Loader2 /> : <Icons.Save />}
                        {loading ? "Saving..." : "Save Configuration"}
                    </Button>
                </div>
            </div>

            {success && (
                <div className="mb-8 bg-emerald-50 border border-emerald-100 p-5 rounded-2xl text-emerald-600 font-black text-xs uppercase tracking-widest flex items-center gap-3 animate-in zoom-in">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">✓</span>
                    Operation completed successfully
                </div>
            )}

            {error && (
                <div className="mb-8 bg-red-50 border border-red-100 p-5 rounded-2xl text-red-600 font-black text-xs uppercase tracking-widest flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-xs">⚠</span>
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    {[
                        { id: 'general', label: 'General Info', icon: <Icons.Store /> },
                        { id: 'contact', label: 'Contact & Social', icon: <Icons.PhoneCall /> },
                        { id: 'staff', label: 'Staff Management', icon: <Icons.Users /> },
                        { id: 'danger', label: 'Danger Zone', icon: <Icons.Trash /> }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === tab.id
                                    ? "bg-white text-blue-600 shadow-md border border-slate-100"
                                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            <span className={activeTab === tab.id ? "text-blue-600" : "text-slate-300"}>
                                {tab.icon}
                            </span>
                            {tab.label}
                        </button>
                    ))}

                    <div className="mt-10 p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">Live Store Link</p>
                        <div className="p-3 bg-white rounded-xl border border-blue-100 text-[11px] font-bold text-slate-600 break-all select-all">
                            {storeUrl}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    {activeTab === 'general' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            {/* Media Section */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Cover Branding</label>
                                    <div className="relative h-56 rounded-[2.5rem] bg-slate-100 border-2 border-dashed border-slate-200 overflow-hidden group shadow-inner">
                                        {coverPreview ? (
                                            <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-slate-300">
                                                <Icons.ImageIcon />
                                            </div>
                                        )}
                                        <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                                            <span className="text-white font-black text-[10px] uppercase tracking-widest bg-white/20 px-6 py-3 rounded-2xl border border-white/20">Replace Header Image</span>
                                            <input type="file" id="cover-upload" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} />
                                        </label>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Identity Mark (Logo)</label>
                                    <div className="relative aspect-square rounded-[2.5rem] bg-white border-2 border-dashed border-slate-200 overflow-hidden group flex items-center justify-center shadow-lg shadow-slate-100">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo" className="w-full h-full object-cover p-3" />
                                        ) : (
                                            <div className="text-slate-200"><Icons.Store /></div>
                                        )}
                                        <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                                            <div className="scale-125 text-white"><Icons.ImageIcon /></div>
                                            <input type="file" id="logo-upload" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Store Name</label>
                                        <Input {...register("storeName", { required: true })} className="h-14 rounded-2xl font-black text-slate-700 bg-slate-50/50 border-none focus:ring-2 focus:ring-blue-600 transition-all shadow-inner" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Operation City</label>
                                        <Input {...register("city", { required: true })} className="h-14 rounded-2xl font-black text-slate-700 bg-slate-50/50 border-none focus:ring-2 focus:ring-blue-600 transition-all shadow-inner" />
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Store Narrative (Description)</label>
                                        <textarea
                                            {...register("description")}
                                            rows={4}
                                            className="w-full p-6 rounded-[2rem] bg-slate-50/50 border-none focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-700 text-sm transition-all shadow-inner resize-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Physical Base (Address)</label>
                                        <div className="relative">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
                                                <Icons.MapPin />
                                            </div>
                                            <Input {...register("address")} className="h-14 rounded-2xl pl-12 font-black text-slate-700 bg-slate-50/50 border-none focus:ring-2 focus:ring-blue-600 transition-all shadow-inner" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'contact' && (
                        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Primary Communication (Phone)</label>
                                    <div className="relative">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
                                            <Icons.Phone />
                                        </div>
                                        <Input {...register("phone", { required: true })} className="h-14 rounded-2xl pl-12 font-black text-slate-700 bg-slate-50/50 border-none focus:ring-2 focus:ring-blue-600 transition-all shadow-inner" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">WhatsApp Integration</label>
                                    <div className="relative">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500 font-black text-[10px]">WA</div>
                                        <Input {...register("whatsapp")} placeholder="+251..." className="h-14 rounded-2xl pl-14 font-black text-slate-700 bg-slate-50/50 border-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Telegram Handle</label>
                                    <div className="relative">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-sky-500">
                                            <Icons.Send />
                                        </div>
                                        <Input {...register("telegram")} placeholder="@username" className="h-14 rounded-2xl pl-12 font-black text-slate-700 bg-slate-50/50 border-none focus:ring-2 focus:ring-sky-500 transition-all shadow-inner" />
                                    </div>
                                </div>
                                <div className="space-y-4 opacity-50">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Secured Email (Locked)</label>
                                    <div className="relative">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
                                            <Icons.Globe />
                                        </div>
                                        <Input value={store.email} disabled className="h-14 rounded-2xl pl-12 font-black text-slate-500 bg-slate-100 border-none cursor-not-allowed shadow-inner" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'staff' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
                                <div className="flex flex-col md:flex-row gap-6 items-end">
                                    <div className="flex-1 space-y-3 w-full">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Add Staff Participant (Email)</label>
                                        <Input
                                            value={staffEmail}
                                            onChange={(e) => setStaffEmail(e.target.value)}
                                            placeholder="collaborator@example.com"
                                            className="h-14 rounded-2xl font-black text-slate-700 bg-slate-50/50 border-none focus:ring-2 focus:ring-blue-600 transition-all shadow-inner w-full"
                                        />
                                    </div>
                                    <div className="space-y-3 w-full md:w-48">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Access Tier</label>
                                        <select
                                            value={staffRole}
                                            onChange={(e) => setStaffRole(e.target.value)}
                                            className="w-full h-14 rounded-2xl px-4 font-black text-slate-700 bg-slate-50/50 border-none focus:ring-2 focus:ring-blue-600 shadow-inner appearance-none text-[11px] uppercase tracking-widest"
                                        >
                                            <option value="editor">Editor</option>
                                            <option value="manager">Manager</option>
                                        </select>
                                    </div>
                                    <Button
                                        onClick={handleAddStaff}
                                        disabled={loading || !staffEmail}
                                        className="h-14 px-8 rounded-2xl bg-blue-600 text-white font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 border-none"
                                    >
                                        Authorize
                                    </Button>
                                </div>

                                <div className="pt-6 border-t border-slate-50">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Active Personnel</p>
                                    <div className="space-y-4">
                                        {/* Owner is always there */}
                                        <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-transparent">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-xl shadow-sm">👑</div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">{store.sellerName}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Store Founder (Owner)</p>
                                                </div>
                                            </div>
                                            <span className="px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest">Full Access</span>
                                        </div>

                                        {store.staff?.map((s: any) => (
                                            <div key={s.userId} className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 shadow-sm transition-all hover:border-slate-200 group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl">👤</div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900">{s.email}</p>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined {new Date(s.addedAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">{s.role}</span>
                                                    <button
                                                        onClick={() => handleRemoveStaff(s.userId)}
                                                        className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                                    >
                                                        <Icons.Trash />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {(!store.staff || store.staff.length === 0) && (
                                            <div className="text-center py-10">
                                                <p className="text-xs font-bold text-slate-400">No additional staff members added yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'danger' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="bg-red-50/50 p-10 rounded-[3rem] border border-red-100 space-y-8">
                                <div className="flex items-start gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center scale-110">
                                        <Icons.AlertTriangle />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-red-900 tracking-tight">Decommission Store</h3>
                                        <p className="text-red-700/70 font-bold text-sm mt-1 max-w-md">
                                            This action is irreversible. All your product listings, analytics data, and store configuration will be permanently deleted.
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-red-100/50">
                                    <Button
                                        onClick={handleDeleteStore}
                                        disabled={loading}
                                        className="h-16 px-10 rounded-2xl bg-red-600 text-white font-black text-[12px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-2xl shadow-red-200 border-none flex items-center gap-3"
                                    >
                                        {loading ? <Icons.Loader2 /> : <Icons.Trash />}
                                        Initialize Permanent Deletion
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
