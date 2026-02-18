import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center bg-white min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative w-full max-w-7xl px-6 pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
          <div className="space-y-10 text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Ethiopia's Digital Marketplace</span>
            </div>

            <h1 className="text-6xl md:text-[7.5rem] font-black text-slate-900 leading-[0.85] tracking-tighter">
              Trade <br />
              <span className="text-blue-600">Smarter.</span>
            </h1>

            <p className="text-slate-500 text-xl md:text-2xl font-medium leading-relaxed max-w-lg">
              The professional standard for buying and selling quality used products across Ethiopia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link href="/dashboard">
                <Button className="px-12 py-5 text-lg shadow-2xl shadow-blue-100 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 border-none transition-all hover:scale-105">
                  Explore Marketplace
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" className="px-12 py-5 text-lg w-full sm:w-auto rounded-xl font-bold border-2 border-slate-100 hover:border-slate-900 transition-all">
                  Open Your Store
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-12 border-t border-slate-50">
              {[
                { label: 'Active Listings', value: '12k+' },
                { label: 'Trusted Sellers', value: '5k+' },
                { label: 'Daily Trades', value: '800+' }
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-blue-600/5 rounded-[4rem] -rotate-6 transition-transform hover:rotate-0 duration-700"></div>
            <div className="relative aspect-[4/5] bg-slate-900 rounded-[3.5rem] p-12 flex flex-col justify-between shadow-2xl overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              <div className="z-10">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-4xl mb-8">🇪🇹</div>
                <h2 className="text-5xl font-black text-white leading-tight tracking-tighter">
                  National <br /> Coverage
                </h2>
              </div>
              <div className="z-10 space-y-4">
                <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl">
                  <p className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-2">Recent Trade</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-lg">iPhone 15 Pro Max</span>
                    <span className="text-blue-500 font-black text-xl">85k ETB</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-xl">
                    <p className="text-white/40 font-bold text-[10px] uppercase mb-1">Location</p>
                    <p className="text-white font-bold text-sm text-center">Addis Ababa</p>
                  </div>
                  <div className="flex-1 bg-blue-600 p-5 rounded-3xl text-center shadow-xl shadow-blue-900/40">
                    <p className="text-white font-black text-sm">Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Senior Level Discovery Section */}
      <section className="w-full bg-slate-50/50 border-t border-slate-100 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                Discovery <br />Simplified.
              </h2>
              <p className="text-slate-500 font-medium text-xl mt-6">
                Curated categories and verified listings for the sophisticated Ethiopian buyer.
              </p>
            </div>
            <Link href="/dashboard" className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
              Browse All Listings
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Electronics', icon: '📱', color: 'bg-blue-50', text: 'text-blue-600' },
              { name: 'Vehicles', icon: '🚗', color: 'bg-emerald-50', text: 'text-emerald-600' },
              { name: 'Fashion', icon: '👕', color: 'bg-amber-50', text: 'text-amber-600' },
              { name: 'Properties', icon: '🏠', color: 'bg-indigo-50', text: 'text-indigo-600' }
            ].map((cat) => (
              <div key={cat.name} className="group p-10 bg-white rounded-[2.5rem] border border-slate-100 hover:border-blue-200 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50 cursor-pointer">
                <div className={`w-20 h-20 ${cat.color} rounded-3xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform duration-500`}>
                  {cat.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">{cat.name}</h3>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Browse Collection</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            { title: 'Safe Transactions', desc: 'Secure payment protocols and buyer protection for peace of mind.' },
            { title: 'Verified Profiles', desc: 'Strict verification for sellers to ensure a professional trading environment.' },
            { title: 'Smart Search', desc: 'Advanced filters to help you find exactly what you need in seconds.' }
          ].map((item) => (
            <div key={item.title} className="space-y-4">
              <div className="w-12 h-1 bg-blue-600 rounded-full mb-6"></div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{item.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
