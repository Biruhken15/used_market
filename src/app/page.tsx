import { Button } from "@/components/ui/button";
import Link from "next/link";
import PricingSection from "@/components/pricing-section";
import { AboutSection } from "@/components/about-section";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <section className="relative w-full pt-44 pb-32 px-10 md:px-20 lg:px-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-10 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Ethiopia's Premium Used Marketplace</span>
              </div>

              <h1 className="text-6xl md:text-[5.5rem] font-extrabold text-slate-900 leading-[0.9] tracking-tighter">
                Used Market <br />
                <span className="gradient-text">Premium Quality.</span>
              </h1>

              <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-xl">
                The most professional and secure platform to trade high-quality used products across the nation. Experience the future of local commerce.
              </p>

              <div className="flex flex-col space-y-4">
                {/* Main Action Button */}
                <Link href="/dashboard">
                  <Button className="w-full md:w-fit !h-16 !px-12 text-lg shadow-2xl shadow-accent/20 rounded-2xl font-bold bg-accent text-white hover:bg-accent-dark border-none transition-all hover:scale-[1.02] active:scale-95">
                    Start trading
                  </Button>
                </Link>

                {/* Secondary Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/auth/register" className="flex-1">
                    <Button variant="outline" className="w-full !h-14 rounded-2xl font-bold border-2 border-slate-200 hover:border-accent hover:bg-accent/5 text-slate-700 transition-all">
                      Create your store
                    </Button>
                  </Link>
                  <Link href="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full !h-14 rounded-2xl font-bold border-2 border-slate-200 hover:border-accent hover:bg-accent/5 text-slate-700 transition-all">
                      Find Used Products
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative premium-card p-2 bg-white border-white/50 shadow-2xl overflow-hidden aspect-[4/5] flex flex-col justify-end">
                <div className="absolute inset-x-0 top-0 h-2/3 bg-slate-100 flex items-center justify-center">
                  <div className="text-[12rem] opacity-20 select-none">📱</div>
                </div>
                <div className="p-8 z-10 bg-white/80 backdrop-blur-md rounded-2xl border border-white m-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent">Feature Listing</span>
                    <span className="text-xs font-bold text-slate-400">Verified</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900">MacBook Pro M2</h3>
                  <div className="flex justify-between items-end">
                    <p className="text-slate-500 font-bold">Addis Ababa</p>
                    <p className="text-2xl font-black text-accent">145k ETB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <div className="px-10 md:px-20 lg:px-32">
        <AboutSection />
      </div>

      {/* Pricing Section */}
      <div className="px-10 md:px-20 lg:px-32">
        <PricingSection />
      </div>

      {/* Stats/Social Proof Section */}
      <section className="w-full py-24 px-10 md:px-20 lg:px-32 bg-slate-900 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--accent)_0%,_transparent_70%)]"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: 'Active Listings', value: '18k+' },
            { label: 'Total Sales', value: '45m+' },
            { label: 'Success Rate', value: '98%' },
            { label: 'Countries', value: '1' }
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">{stat.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
