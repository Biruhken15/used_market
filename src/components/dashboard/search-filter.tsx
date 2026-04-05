"use client";

import { useState } from "react";

export const SearchFilter = () => {
    const categories = [
        "All Products",
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
    const [activeCategory, setActiveCategory] = useState("All Products");

    return (
        <div className="w-full bg-slate-50/50 border-b border-slate-100 pb-12 pt-16">
            <div className="max-w-6xl mx-auto px-4">
                {/* Search Bar Refined */}
                <div className="max-w-5xl mx-auto mb-10">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search for products, brands, or categories..."
                            className="w-full h-16 pl-16 pr-32 rounded-2xl bg-white border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-50/40 outline-none transition-all duration-300 text-lg font-medium text-slate-900 placeholder:text-slate-400 shadow-sm"
                        />
                        <div className="absolute right-2 top-2 bottom-2">
                            <button className="h-full px-8 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-xl font-bold text-base shadow-lg shadow-indigo-100 flex items-center gap-2 hover:brightness-110 hover:scale-[1.02] transition-all active:scale-95">
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                {/* Horizontal Categories - Sleek Version */}
                <div className="max-w-5xl mx-auto overflow-hidden">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 thin-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`whitespace-nowrap px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 border-2 ${activeCategory === cat
                                    ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-200 scale-[1.02]"
                                    : "bg-white border-transparent text-slate-500 hover:border-slate-200 hover:text-slate-900"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
