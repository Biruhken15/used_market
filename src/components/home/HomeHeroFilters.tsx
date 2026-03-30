"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
    MapPin, 
    Layers, 
    Globe,
    ChevronDown,
    Search
} from "lucide-react";

export const HomeHeroFilters = ({ isMobile = false }: { isMobile?: boolean }) => {
    const router = useRouter();
    const [region, setRegion] = useState("All Regions");
    const [category, setCategory] = useState("All Categories");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleApplyFilters = () => {
        const params = new URLSearchParams();
        if (region !== "All Regions") params.set("region", region);
        if (category !== "All Categories") params.set("category", category.toLowerCase());
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        
        router.push(`/products?${params.toString()}`);
        if (isMobile) setIsOpen(false);
    };

    if (isMobile && !isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="w-full h-14 bg-white border border-slate-200 rounded-2xl px-5 flex items-center justify-between shadow-sm active:scale-[0.98] transition-all"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                        <Search className="w-5 h-5 text-violet-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter Items</p>
                        <p className="text-sm font-black text-slate-900 tracking-tight">Search for anything...</p>
                    </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
            </button>
        );
    }

    const FilterContent = () => (
        <div className={`flex flex-col h-full ${isMobile ? 'p-0' : ''}`}>
            <div className="mb-4 md:mb-6">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                    <Layers className="w-3 h-3 text-violet-600" />
                    Marketplace Filters
                </h3>
                <div className="space-y-4">
                    {/* Country Filter */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Country</label>
                        <div className="relative group">
                            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <select className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-transparent rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-violet-500 outline-none transition-all appearance-none cursor-pointer">
                                <option>Ethiopia</option>
                            </select>
                            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Region Filter */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Region</label>
                        <div className="relative group">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <select 
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-transparent rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-violet-500 outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option>All Regions</option>
                                <option>Addis Ababa</option>
                                <option>Oromia</option>
                                <option>Amhara</option>
                                <option>Tigray</option>
                                <option>Sidama</option>
                            </select>
                            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
                        <div className="relative group">
                            <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-transparent rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-violet-500 outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option>All Categories</option>
                                <option>Electronics</option>
                                <option>Fashion</option>
                                <option>Vehicles</option>
                                <option>Home & Garden</option>
                                <option>Real Estate</option>
                            </select>
                            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Price Range (ETB)</label>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400">ETB</span>
                                <input 
                                    type="number" 
                                    placeholder="Min"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full h-12 pl-8 pr-2 bg-slate-50 border border-transparent rounded-xl text-[11px] font-bold text-slate-900 focus:bg-white focus:border-violet-500 outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>
                            <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400">ETB</span>
                                <input 
                                    type="number" 
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full h-12 pl-8 pr-2 bg-slate-50 border border-transparent rounded-xl text-[11px] font-bold text-slate-900 focus:bg-white focus:border-violet-500 outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Button 
                onClick={handleApplyFilters}
                className="mt-auto w-full h-14 bg-gradient-to-r from-violet-600 to-pink-600 active:scale-[0.98] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
                <Search className="w-4 h-4" />
                Show Results
            </Button>
        </div>
    );

    if (isMobile) {
        return (
            <div className={`fixed inset-0 z-[100] ${isOpen ? 'flex' : 'hidden'} flex-col bg-white p-6 animate-drawer-in`}>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic">Search Filters</h2>
                    <button onClick={() => setIsOpen(false)} className="p-2 rounded-full bg-slate-50">
                        <ChevronDown className="w-6 h-6 text-slate-900" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto thin-scrollbar">
                    <FilterContent />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-100 rounded-2xl md:rounded-[2rem] p-4 md:p-8 h-full flex flex-col shadow-sm">
            <FilterContent />
        </div>
    );
};
