"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
    MapPin, 
    Layers, 
    DollarSign, 
    Globe,
    ChevronDown,
    Search
} from "lucide-react";

export const HomeHeroFilters = () => {
    return (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 h-full flex flex-col shadow-sm">
            <div className="mb-6">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                    <Layers className="w-3 h-3 text-blue-600" />
                    Marketplace Filters
                </h3>
                <div className="space-y-4">
                    {/* Country Filter */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Country</label>
                        <div className="relative group">
                            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <select className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-transparent rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer">
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
                            <select className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-transparent rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer">
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
                            <select className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-transparent rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer">
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
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Price Max (ETB)</label>
                        <div className="relative group">
                            <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input 
                                type="number" 
                                placeholder="Any price"
                                className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-transparent rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Button className="mt-auto w-full h-12 bg-blue-600 hover:bg-slate-950 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-100/50 flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                Apply Filters
            </Button>
        </div>
    );
};
