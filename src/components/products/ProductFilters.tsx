"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Filter, ChevronDown, Check, X, MapPin, Tag, CircleDollarSign, ArrowRight } from "lucide-react";

export function ProductFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

    const categories = ["Electronics", "Vehicles", "Property", "Fashion", "Home", "Other"];
    const regions = ["Addis Ababa", "Oromia", "Amhara", "Dire Dawa", "Tigray", "SNNPR", "Other"];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'All') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set("page", "1");
        router.push(`/products?${params.toString()}`);
        setActiveDropdown(null);
    };

    const handlePriceSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (minPrice) params.set("minPrice", minPrice); else params.delete("minPrice");
        if (maxPrice) params.set("maxPrice", maxPrice); else params.delete("maxPrice");
        params.set("page", "1");
        router.push(`/products?${params.toString()}`);
        setActiveDropdown(null);
    };

    const clearFilters = () => {
        router.push("/products");
        setMinPrice("");
        setMaxPrice("");
        setActiveDropdown(null);
    };

    const isFiltered = searchParams.get("category") || searchParams.get("region") || searchParams.get("minPrice") || searchParams.get("maxPrice");

    const DropdownButton = ({ label, value, id, icon: Icon }: any) => (
        <button
            onClick={() => setActiveDropdown(activeDropdown === id ? null : id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all text-[11px] font-black uppercase tracking-widest whitespace-nowrap ${
                value 
                ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200" 
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-900 hover:text-slate-900"
            }`}
        >
            {Icon && <Icon size={14} className={value ? "text-violet-400" : "text-slate-300"} />}
            {value || label}
            <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === id ? "rotate-180" : ""}`} />
        </button>
    );

    return (
        <div className="w-full bg-white/50 backdrop-blur-md sticky top-20 z-40 border-b border-slate-100 py-4 mb-4 md:mb-8" ref={dropdownRef}>
            <div className="max-w-7xl mx-auto px-4 md:px-10 flex items-center relative">
                {/* Horizontal scroll container */}
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 md:pb-0 w-full md:w-auto md:flex-wrap">
                    <div className="flex items-center gap-2 shrink-0 border-r border-slate-200 pr-4 mr-1 hidden md:flex">
                        <Filter size={14} className="text-slate-900" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 italic">Filter Protocol</span>
                    </div>

                {/* Category Dropdown */}
                <div className="relative">
                    <DropdownButton 
                        label="Category" 
                        value={searchParams.get("category")} 
                        id="category" 
                        icon={Tag} 
                    />
                    {activeDropdown === 'category' && (
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                            <button onClick={() => updateFilter("category", "")} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 text-[10px] font-bold uppercase tracking-widest flex items-center justify-between group">
                                All Categories
                                {!searchParams.get("category") && <Check size={14} className="text-violet-600" />}
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => updateFilter("category", cat)}
                                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 text-[10px] font-bold uppercase tracking-widest flex items-center justify-between group"
                                >
                                    {cat}
                                    {searchParams.get("category") === cat && <Check size={14} className="text-violet-600" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Region Dropdown */}
                <div className="relative">
                    <DropdownButton 
                        label="Region" 
                        value={searchParams.get("region")} 
                        id="region" 
                        icon={MapPin} 
                    />
                    {activeDropdown === 'region' && (
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                            <button onClick={() => updateFilter("region", "")} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 text-[10px] font-bold uppercase tracking-widest flex items-center justify-between group">
                                All Regions
                                {!searchParams.get("region") && <Check size={14} className="text-violet-600" />}
                            </button>
                            {regions.map((reg) => (
                                <button
                                    key={reg}
                                    onClick={() => updateFilter("region", reg)}
                                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 text-[10px] font-bold uppercase tracking-widest flex items-center justify-between group"
                                >
                                    {reg}
                                    {searchParams.get("region") === reg && <Check size={14} className="text-violet-600" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Price Dropdown */}
                <div className="relative">
                    <DropdownButton 
                        label="Price Range" 
                        value={(minPrice || maxPrice) ? `${minPrice || 0} - ${maxPrice || '∞'}` : null} 
                        id="price" 
                        icon={CircleDollarSign} 
                    />
                    {activeDropdown === 'price' && (
                        <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-100 rounded-2xl shadow-2xl p-6 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                            <form onSubmit={handlePriceSubmit} className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 space-y-1.5">
                                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Min ETB</label>
                                        <input 
                                            type="number" 
                                            placeholder="0" 
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none focus:border-slate-900 transition-all"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1.5">
                                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Max ETB</label>
                                        <input 
                                            type="number" 
                                            placeholder="Max" 
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none focus:border-slate-900 transition-all"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full h-11 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-600 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
                                    Apply Range
                                    <ArrowRight size={14} />
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                </div>
                {/* Reset Button */}
                {isFiltered && (
                    <button 
                        onClick={clearFilters}
                        className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-50 rounded-full transition-all ml-auto shrink-0"
                    >
                        <X size={14} />
                        Clear All
                    </button>
                )}
            </div>
        </div>
    );
}
