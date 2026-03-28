"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

function SearchIcon() {
    return (
        <svg className="w-4 h-4 text-slate-900" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
        </svg>
    );
}

function SpinnerIcon() {
    return <div className="w-4 h-4 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin flex-shrink-0" />;
}

interface SearchResults {
    users: any[];
    stores: any[];
    products: any[];
}

export function AdminSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResults | null>(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const runSearch = useCallback(async (q: string) => {
        if (q.length < 2) { setResults(null); setOpen(false); return; }
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/search?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            setResults(data);
            setOpen(true);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => runSearch(val), 350);
    };

    const totalResults = results
        ? results.users.length + results.stores.length + results.products.length
        : 0;

    return (
        <div ref={containerRef} className="relative w-full max-w-xl">
            {/* Search Input */}
            <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus-within:border-slate-950 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-950/5 transition-all">
                {loading ? <SpinnerIcon /> : <SearchIcon />}
                <input
                    type="text"
                    value={query}
                    onChange={handleInput}
                    onFocus={() => results && setOpen(true)}
                    placeholder="Search by name, ID, store, product…"
                    className="flex-1 bg-transparent text-sm text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none"
                />
                {query && (
                    <button onClick={() => { setQuery(""); setResults(null); setOpen(false); }} className="text-slate-300 hover:text-slate-500 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
                    </button>
                )}
            </div>

            {/* Dropdown Results */}
            {open && results && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/60 z-50 overflow-hidden max-h-[480px] overflow-y-auto">
                    {totalResults === 0 ? (
                        <div className="p-6 text-center">
                            <p className="text-sm font-bold text-slate-400">No results for &quot;{query}&quot;</p>
                            <p className="text-[10px] text-slate-300 font-medium mt-1">Try a name, email, or paste a full ID</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {/* Users */}
                            {results.users.length > 0 && (
                                <div>
                                    <div className="px-4 pt-3 pb-1.5">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Users</span>
                                    </div>
                                    {results.users.map((u: any) => (
                                        <Link key={u._id} href="/admin/users" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 transition-colors group">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs flex-shrink-0 overflow-hidden">
                                                {u.image ? <img src={u.image} alt={u.name} className="w-full h-full object-cover" /> : (u.name?.charAt(0) || '?').toUpperCase()}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-bold text-slate-900 truncate">{u.name || "Unknown"}</p>
                                                <p className="text-[10px] text-slate-400 font-medium truncate">{u.email}</p>
                                            </div>
                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>{u.role || 'user'}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Stores */}
                            {results.stores.length > 0 && (
                                <div>
                                    <div className="px-4 pt-3 pb-1.5">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Stores</span>
                                    </div>
                                    {results.stores.map((s: any) => (
                                        <Link key={s._id} href="/admin/stores" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 transition-colors group">
                                            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-black text-xs flex-shrink-0 overflow-hidden border border-slate-200">
                                                {s.logo?.url ? <img src={s.logo.url} alt={s.storeName} className="w-full h-full object-cover" /> : s.storeName.charAt(0)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-bold text-slate-900 truncate">{s.storeName}</p>
                                                <p className="text-[10px] text-slate-400 font-medium truncate">Owner: {s.ownerId?.name || s.sellerName || 'Unknown'}</p>
                                            </div>
                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${s.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>{s.status}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Products */}
                            {results.products.length > 0 && (
                                <div>
                                    <div className="px-4 pt-3 pb-1.5">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Products</span>
                                    </div>
                                    {results.products.map((p: any) => (
                                        <Link key={p._id} href="/admin/products" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 transition-colors group">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                                {p.thumbnail
                                                    ? <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                                                    : <div className="w-full h-full flex items-center justify-center text-base">📦</div>}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-bold text-slate-900 truncate">{p.title}</p>
                                                <p className="text-[10px] text-slate-400 font-medium truncate">{p.storeId?.storeName || '—'} • {p.price?.toLocaleString()} ETB</p>
                                            </div>
                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${p.status === 'active' ? 'bg-indigo-100 text-indigo-600' : 'bg-rose-100 text-rose-600'}`}>{p.status}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            <div className="px-4 py-3 bg-slate-50">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{totalResults} result{totalResults !== 1 ? 's' : ''} · Paste any ID for exact match</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
