"use client";

import { Card } from "../ui/card";
import { Button } from "../ui/button";

export const ProductGrid = () => {
    // Placeholder data
    const products = [
        { id: 1, name: "Premium Leather Sofa", price: "$450", category: "Furniture", location: "Addis Ababa", time: "2h ago", image: "🛋️" },
        { id: 2, name: "MacBook Pro M2 14\"", price: "$1,200", category: "Electronics", location: "Bahar Dar", time: "5h ago", image: "💻" },
        { id: 3, name: "Vintage Denim Jacket", price: "$25", category: "Fashion", location: "Adama", time: "1d ago", image: "👕" },
        { id: 4, name: "Toyota Corolla 2018", price: "$22,000", category: "Vehicles", location: "Dire Dawa", time: "3d ago", image: "🚗" },
        { id: 5, name: "Smart Watch Series 7", price: "$180", category: "Electronics", location: "Hawassa", time: "4h ago", image: "⌚" },
        { id: 6, name: "Office Chair Ergonomic", price: "$120", category: "Furniture", location: "Addis Ababa", time: "1w ago", image: "💺" },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-20">
            <div className="flex items-center justify-between mb-12 px-2">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900 mb-1">Recommended for You</h2>
                    <p className="text-slate-500 font-medium text-sm">Based on your recent activity and preferences</p>
                </div>
                <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm active:scale-95">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                    <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm active:scale-95">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <Card key={product.id} className="group overflow-hidden rounded-[2rem] border border-slate-100 bg-white hover:border-blue-200 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50">
                        <div className="aspect-square bg-slate-50 flex items-center justify-center text-7xl transition-all duration-500 group-hover:scale-105">
                            {product.image}
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{product.category}</span>
                                    <span className="text-lg font-black text-slate-900">{product.price}</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">{product.name}</h3>
                            </div>

                            <div className="flex items-center gap-3 text-slate-400 font-bold text-[11px] mb-6">
                                <span className="flex items-center gap-1">📍 {product.location}</span>
                                <span className="flex items-center gap-1">• {product.time}</span>
                            </div>

                            <div className="flex gap-2">
                                <Button fullWidth className="rounded-xl font-bold text-xs py-3 bg-slate-900 text-white hover:bg-blue-600 border-none transition-all">
                                    View Item
                                </Button>
                                <button className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-lg text-slate-300 transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-100">
                                    ❤️
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="mt-16 text-center">
                <button className="px-10 py-4 rounded-xl font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all active:scale-95">
                    Browse All Products
                </button>
            </div>
        </div>
    );
};
