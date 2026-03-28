import { Button } from '@/components/ui/button';
import { Search, Home, Ghost } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100 text-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex justify-center">
                    <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-300 relative group border-2 border-dashed border-slate-200">
                        <Ghost size={64} className="group-hover:translate-y-[-10px] transition-transform duration-500" />
                        <div className="absolute -bottom-2 w-16 h-4 bg-slate-200/40 rounded-full blur-md animate-pulse"></div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 rounded-full border border-violet-100">
                        <span className="text-[10px] font-black uppercase tracking-widest text-violet-600">404 - Lost in Protocol</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Page Not Found</h1>
                    <p className="text-slate-500 font-bold text-sm leading-relaxed px-4">
                        We couldn't find the page you were looking for. It might have been relocated or purged from our registry.
                    </p>
                </div>

                <div className="space-y-3 pt-4">
                    <Link href="/products" className="block w-full">
                        <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-xl shadow-indigo-100 transition-all border-none">
                            <Search className="w-4 h-4 mr-2" />
                            Discover Products
                        </Button>
                    </Link>
                    <Link href="/" className="block w-full">
                        <Button variant="ghost" className="w-full h-12 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">
                            <Home className="w-4 h-4 mr-2" />
                            Back to Base
                        </Button>
                    </Link>
                </div>

                <div className="pt-2 flex flex-col items-center">
                    <span className="text-[20px] font-black text-slate-900 tracking-tighter italic opacity-20">ከሰው እጅ</span>
                </div>
            </div>
        </div>
    );
}
