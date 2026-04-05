"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Sparkles, Package, MapPin, Store as StoreIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

export const ProductSearch = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [isFocused, setIsFocused] = useState(false);
    const [results, setResults] = useState<{ stores: any[], products: any[] } | null>(null);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle clicking outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchResults = async (q: string) => {
        if (q.length < 2) {
            setResults(null);
            setShowDropdown(false);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            if (res.ok) {
                setResults(data);
                setShowDropdown(true);
            }
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query && isFocused) {
                fetchResults(query);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        setShowDropdown(false);
        const params = new URLSearchParams(searchParams.toString());
        if (query) {
            params.set("q", query);
        } else {
            params.delete("q");
        }
        params.set("page", "1");
        router.push(`/products?${params.toString()}`);
    };

    const clearSearch = () => {
        setQuery("");
        setResults(null);
        setShowDropdown(false);
    };

    return (
        <div className="w-full max-w-2xl mx-auto px-4 relative" ref={dropdownRef}>
            <form
                onSubmit={handleSearch}
                className={`group relative flex items-center bg-white rounded-2xl border-2 transition-all duration-500 shadow-sm z-[60] ${isFocused
                        ? "border-slate-900 ring-8 ring-slate-900/5 shadow-2xl shadow-slate-200"
                        : "border-slate-100"
                    }`}
            >
                <div className={`pl-6 pr-3 transition-colors ${isFocused ? "text-slate-900" : "text-slate-300"}`}>
                    <Search className="w-5 h-5" strokeWidth={3} />
                </div>

                <input
                    type="text"
                    placeholder="Search products, brands, or IDs..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (!isFocused) setIsFocused(true);
                    }}
                    onFocus={() => {
                        setIsFocused(true);
                        if (query.length >= 2) setShowDropdown(true);
                    }}
                    className="flex-1 h-12 bg-transparent border-none outline-none text-slate-900 font-black placeholder:text-slate-300 placeholder:font-bold text-sm uppercase tracking-tight"
                />

                {query && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="p-2 mr-1 text-slate-300 hover:text-slate-900 transition-colors"
                    >
                        <X className="w-5 h-5" strokeWidth={3} />
                    </button>
                )}

                <button
                    type="submit"
                    className="mr-2 h-9 px-6 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-violet-600 active:scale-95 transition-all shadow-lg"
                >
                    <span className="flex items-center gap-2">
                        Find 
                        <ArrowRight className="w-3 h-3" strokeWidth={4} />
                    </span>
                </button>
            </form>

            {/* Global Search Dropdown */}
            {showDropdown && results && (
                <div className="absolute top-full left-4 right-4 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 border-t-0 p-2">
                    <div className="max-h-[70vh] overflow-y-auto">
                        {/* Stores Section */}
                        {results.stores.length > 0 && (
                            <div className="mb-4">
                                <div className="px-3 py-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trusted Stores</span>
                                </div>
                                <div className="space-y-1">
                                    {results.stores.map((store: any) => (
                                        <Link
                                            key={store._id}
                                            href={`/stores/${store.storeSlug || store._id}`}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all overflow-hidden border border-slate-200">
                                                {store.logo?.url ? <img src={store.logo.url} alt={store.storeName} className="w-full h-full object-cover" /> : <StoreIcon size={18} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-900 truncate uppercase italic">{store.storeName}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Official Dealer</p>
                                            </div>
                                            <ArrowRight size={14} className="text-slate-200 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Products Section */}
                        {results.products.length > 0 && (
                            <div>
                                <div className="px-3 py-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Products Found</span>
                                </div>
                                <div className="grid grid-cols-1 gap-1">
                                    {results.products.map((product: any) => (
                                        <Link
                                            key={product._id}
                                            href={`/products/${product.slug || product._id}`}
                                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all group"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <div className="w-12 h-12 rounded-lg bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                                                {product.images?.[0] ? (
                                                    <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
                                                ) : <div className="w-full h-full flex items-center justify-center text-xl">📦</div>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-950 truncate uppercase tracking-tight italic">{product.title}</p>
                                                <p className="text-[11px] font-black text-slate-900">{product.price.toLocaleString()} <span className="text-[8px] opacity-40">ETB</span></p>
                                            </div>
                                            <ArrowRight size={14} className="text-slate-200 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {results.stores.length === 0 && results.products.length === 0 && !loading && (
                            <div className="py-12 text-center">
                                <Search className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">No instant matches found</p>
                                <p className="text-[9px] text-slate-300 font-bold uppercase mt-1">Press enter for deep search</p>
                            </div>
                        )}
                    </div>

                    {/* Footer / Full Search Link */}
                    <button
                        onClick={handleSearch}
                        className="w-full mt-2 p-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
                    >
                        See All Results for &quot;{query}&quot;
                        <ArrowRight size={12} />
                    </button>
                </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-400">
                <span className="uppercase tracking-widest text-[10px] opacity-60">Trending:</span>
                {['iPhone', 'Toyota', 'Apartment', 'Laptops'].map((tag) => (
                    <button
                        key={tag}
                        type="button"
                        onClick={() => { setQuery(tag); router.push(`/products?q=${tag}`); }}
                        className="hover:text-slate-900 transition-colors underline decoration-slate-200 decoration-2 underline-offset-4"
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
};
