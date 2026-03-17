import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AboutSection } from "@/components/about-section";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section - Clean & High Contrast */}
      <section className="relative w-full pt-44 pb-32 px-6 md:px-20 lg:px-32 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border-2 border-slate-900 rounded-lg">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Official Marketplace • Ethiopia</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-950 leading-[1.1] tracking-tighter">
                Used Market.<br />
                <span className="text-accent italic">ከሰው እጅ</span>
              </h1>

              <p className="text-slate-600 text-xl font-medium leading-relaxed max-w-lg">
                The most professional way to trade high-quality used products in Ethiopia. Experience a secure, verified marketplace built for everyone.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/dashboard">
                  <Button className="h-16 px-10 rounded-xl bg-slate-950 text-white font-black text-lg hover:bg-blue-600 transition-all border-none">
                    Start Selling Now
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="h-16 px-10 rounded-xl border-2 border-slate-200 text-slate-900 font-black text-lg hover:border-slate-950 transition-all">
                    Find Products
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="border-[12px] border-slate-100 rounded-[3rem] overflow-hidden aspect-square bg-white flex items-center justify-center p-12 shadow-sm relative group">
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img src="/ethiopian-mascot.png" alt="Marketplace Mascot" className="w-full h-full object-contain relative z-10 transition-transform duration-700 group-hover:scale-110" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage & Narrative Section - Storytelling */}
      <section className="w-full py-32 px-6 md:px-20 lg:px-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic">Our Heritage</h2>
            <p className="text-[11px] font-black text-accent uppercase tracking-[0.4em]">ከሰው እጅ • From Person to Person</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
            <div className="space-y-8 order-2 lg:order-1">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                A Tradition of Trust<br />
                <span className="text-slate-400">Ethiopia's Second-Hand Legacy</span>
              </h3>
              <p className="text-slate-600 text-lg font-medium leading-relaxed italic">
                "In Ethiopia, every used item carries a story of quality and endurance. Our marketplace honors this tradition by connecting verified sellers directly with buyers, preserving the 'hand-to-hand' (ከሰው እጅ) essence that has defined our local trade for generations."
              </p>
              <div className="pt-4 grid grid-cols-2 gap-8 border-t border-slate-100 mt-12">
                <div>
                  <p className="text-2xl font-black text-slate-900 mb-1 italic text-accent">Merkato Spirit</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Modern technology meet heritage trade</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 mb-1 italic text-accent">Value First</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Ensuring every product finds its next home</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border-[16px] border-slate-50 shadow-2xl skew-y-2 hover:skew-y-0 transition-transform duration-1000">
                <img src="/market-narrative-1.png" alt="Traditional Ethiopian Market" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/10 grayscale hover:grayscale-0 transition-all duration-700"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-24">
            <div className="group rounded-[2.5rem] overflow-hidden border-2 border-slate-100 bg-white shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="aspect-video relative overflow-hidden">
                <img src="/market-narrative-2.png" alt="Ethiopian Treasures" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
                <div className="absolute bottom-6 left-8 text-white">
                  <p className="text-xl font-black italic">Timeless Quality</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">From Jebena to Modern Tech</p>
                </div>
              </div>
            </div>
            <div className="group rounded-[2.5rem] overflow-hidden border-2 border-slate-100 bg-white shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="aspect-video relative overflow-hidden">
                <img src="/market-narrative-3.png" alt="Hand to Hand Exchange" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
                <div className="absolute bottom-6 left-8 text-white">
                  <p className="text-xl font-black italic">Verified Trust</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Secure Hand-to-Hand Exchange</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - 4-Step 2x2 Grid */}
      <section className="w-full py-24 px-6 md:px-20 lg:px-32 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tighter uppercase italic">Success Path</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Four Simple Steps to Start Trading</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
            {[
              { step: '01', title: 'Create Account', desc: 'Securely sign up and verify your official profile in seconds.' },
              { step: '02', title: 'Create Store', desc: 'Build your professional storefront and define your brand identity.' },
              { step: '03', title: 'Add Product', desc: 'Upload high-quality images and set your professional price points.' },
              { step: '04', title: 'Start Selling', desc: 'Connect with verified buyers and begin your trade journey.' },
            ].map((item) => (
              <div key={item.step} className="space-y-4 group">
                <div className="flex items-center gap-6">
                  <div className="text-[12px] font-black uppercase tracking-widest text-blue-600 border-2 border-blue-600 w-12 h-12 flex items-center justify-center rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg shadow-blue-600/10">{item.step}</div>
                  <h3 className="text-2xl font-black text-slate-950 uppercase italic tracking-tight">{item.title}</h3>
                </div>
                <p className="text-slate-500 font-bold leading-relaxed pl-18">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Stats - Final Social Proof */}
      <section className="w-full py-20 px-6 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: 'Active Listings', value: '18k+' },
            { label: 'Verified Stores', value: '2.5k+' },
            { label: 'Market Growth', value: '450%' },
            { label: 'Reliability', value: '100%' }
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-black tracking-tighter mb-1 italic">{stat.value}</p>
              <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
