export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import { FeatureBar } from "@/components/home/FeatureBar";
import { HomeHero, HomeHeroSkeleton } from "@/components/home/HomeHero";
import { 
    PromotedRow, 
    FeaturedRow, 
    UrgentRow, 
    NewArrivalsRow, 
    CategoryRow, 
    BrokerRow 
} from "@/components/home/HomeProductRows";
import { ProductRowSkeleton } from "@/components/home/ProductRowSkeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pt-36">
      {/* Top Navigation below Navbar */}
      <FeatureBar />

      {/* Hero / Promo Section with Filters (Streamed) */}
      <Suspense fallback={<HomeHeroSkeleton />}>
        <HomeHero />
      </Suspense>

      {/* Main Marketplace Sections */}
      <div className="space-y-1 pb-20">
        <header className="px-4 md:px-10 pt-12 pb-4">
            <h2 className="text-3xl md:text-4xl font-black text-slate-950 italic tracking-tighter uppercase">
                Discover Used Products.
            </h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">
                Verified Listings & Handpicked Deals
            </p>
        </header>

        {/* Streaming Rows */}
        <Suspense fallback={<ProductRowSkeleton title="Checking Promotions..." />}>
          <PromotedRow />
        </Suspense>

        <Suspense fallback={<ProductRowSkeleton title="Analyzing Featured..." />}>
          <FeaturedRow />
        </Suspense>

        <Suspense fallback={<ProductRowSkeleton title="Scanning Urgent Deals..." />}>
          <UrgentRow />
        </Suspense>

        <Suspense fallback={<ProductRowSkeleton title="Fresh Arrivals..." />}>
          <NewArrivalsRow />
        </Suspense>

        <Suspense fallback={<ProductRowSkeleton title="Real Estate & Property..." />}>
          <CategoryRow title="Real Estate & Property" category="Real Estate & Property" />
        </Suspense>

        <Suspense fallback={<ProductRowSkeleton title="Vehicles & Cars..." />}>
          <CategoryRow title="Vehicles & Cars" category="Vehicles & Cars" />
        </Suspense>

        <Suspense fallback={<ProductRowSkeleton title="Phones & Tablets..." />}>
          <CategoryRow title="Phones & Tablets" category="Phones & Tablets" />
        </Suspense>

        <Suspense fallback={<ProductRowSkeleton title="Computers & Laptops..." />}>
          <CategoryRow title="Computers & Laptops" category="Computers & Laptops" />
        </Suspense>

        <Suspense fallback={<ProductRowSkeleton title="Home Appliances..." />}>
          <CategoryRow title="Home Appliances" category="Home Appliances" />
        </Suspense>

        <Suspense fallback={<ProductRowSkeleton title="Electronics..." />}>
          <CategoryRow title="Electronics" category="Electronics" />
        </Suspense>

        <Suspense fallback={<ProductRowSkeleton title="Furniture & Decor..." />}>
          <CategoryRow title="Furniture & Decor" category="Furniture & Decor" />
        </Suspense>

        <Suspense fallback={<ProductRowSkeleton title="Construction & Materials..." />}>
          <CategoryRow title="Construction & Materials" category="Construction & Materials" />
        </Suspense>

        <Suspense fallback={<ProductRowSkeleton title="Heavy Machinery & Equipment..." />}>
          <CategoryRow title="Heavy Machinery & Equipment" category="Heavy Machinery & Equipment" />
        </Suspense>

        <Suspense fallback={<ProductRowSkeleton title="Office & Business..." />}>
          <CategoryRow title="Office & Business" category="Office & Business" />
        </Suspense>

        <Suspense fallback={<ProductRowSkeleton title="Fashion & Wearables..." />}>
          <CategoryRow title="Fashion & Wearables" category="Fashion & Wearables" />
        </Suspense>

        <Suspense fallback={<ProductRowSkeleton title="Sports & Outdoors..." />}>
          <CategoryRow title="Sports & Outdoors" category="Sports & Outdoors" />
        </Suspense>

        <Suspense fallback={<ProductRowSkeleton title="Health & Beauty..." />}>
          <CategoryRow title="Health & Beauty" category="Health & Beauty" />
        </Suspense>

        <Suspense fallback={<ProductRowSkeleton title="Books & Education..." />}>
          <CategoryRow title="Books & Education" category="Books & Education" />
        </Suspense>

        <Suspense fallback={<ProductRowSkeleton title="Professional Services..." />}>
          <CategoryRow title="Services" category="Services" />
        </Suspense>

        <Suspense fallback={<ProductRowSkeleton title="Other..." />}>
          <CategoryRow title="Other" category="Other" />
        </Suspense>

        <Suspense fallback={<ProductRowSkeleton title="Agent Portfolios..." />}>
          <BrokerRow />
        </Suspense>

        {/* Sell CTA Section */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-20">
          <div className="relative rounded-[3rem] overflow-hidden bg-slate-950 p-12 md:p-20 text-center text-white border border-white/5">
            <div className="absolute inset-0 opacity-20 filter grayscale">
              <img src="/market-narrative-1.png" alt="Overlay" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 backdrop-blur-md">
                <span className="text-[10px] font-black uppercase tracking-widest text-violet-400">Join the Paradigm Shift</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none">
                Start selling for free today.
              </h2>
              <p className="text-white/60 text-lg font-bold">
                "Pay a little, enjoy big commissions." The premier platform for verified merchants.
              </p>
              <div className="pt-4">
                <Link href="/stores/create">
                  <Button className="h-16 px-12 bg-white text-slate-950 hover:bg-violet-600 hover:text-white font-black text-lg rounded-2xl transition-all shadow-2xl hover:scale-105 active:scale-95">
                    Create Your Store Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
