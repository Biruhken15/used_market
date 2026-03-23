import { FeatureBar } from "@/components/home/FeatureBar";
import { PromoCarousel } from "@/components/home/PromoCarousel";
import { ProductCarouselRow } from "@/components/home/ProductCarouselRow";
import { ProductService } from "@/lib/services/product-service";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchFilter } from "@/components/dashboard/search-filter";
import { HomeHeroFilters } from "@/components/home/HomeHeroFilters";

export default async function Home() {
  // Fetch products for different sections in parallel for performance
  const [
    { products: promotedProducts },
    { products: featuredProducts },
    { products: urgentProducts },
    { products: newArrivals },
    { products: phoneAndElectronics },
    { products: realEstate },
    { products: vehicles },
    { products: brokerItems }
  ] = await Promise.all([
    ProductService.getMarketplaceProducts({ hasPromotedPlan: true }, 1, 10),
    ProductService.getMarketplaceProducts({ isFeatured: true }, 1, 10),
    ProductService.getMarketplaceProducts({ isUrgent: true }, 1, 10),
    ProductService.getMarketplaceProducts({ last24Hours: true }, 1, 10),
    ProductService.getMarketplaceProducts({ category: 'electronics' }, 1, 10),
    ProductService.getMarketplaceProducts({ category: 'real-estate' }, 1, 10),
    ProductService.getMarketplaceProducts({ category: 'vehicles' }, 1, 10),
    ProductService.getMarketplaceProducts({ 'store.storeType': 'broker' }, 1, 10),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 pt-28">
      {/* Top Navigation below Navbar */}
      <FeatureBar />

      {/* Hero / Promo Section with Filters */}
      <section className="max-w-7xl mx-auto w-full px-4 md:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Sidebar Filters */}
          <div className="lg:col-span-1 h-full">
            <HomeHeroFilters />
          </div>

          {/* Right: Promotional Carousel */}
          <div className="lg:col-span-3">
            <div className="h-full rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-200">
                <PromoCarousel initialProducts={promotedProducts} />
            </div>
          </div>
        </div>
      </section>

      {/* Main Marketplace Sections */}
      <div className="space-y-4 pb-20">
        
        <header className="px-4 md:px-10 pt-12 pb-4">
            <h2 className="text-3xl md:text-4xl font-black text-slate-950 italic tracking-tighter">
                Explore Used Products.
            </h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">
                Verified Listings & Handpicked Deals
            </p>
        </header>

        {/* Promoted Products (Real-time based on Subscription) */}
        {promotedProducts.length > 0 && (
          <ProductCarouselRow
            title="Promoted Stores"
            products={promotedProducts}
            filterUrl="/products?promoted=true"
          />
        )}

        {/* Featured Products */}
        <ProductCarouselRow
          title="Featured Products"
          products={featuredProducts}
          filterUrl="/products/featured"
        />

        {/* Urgent Section */}
        <ProductCarouselRow
          title="Urgent Deals ⚡"
          products={urgentProducts}
          filterUrl="/products/urgent"
        />

        {/* New Arrivals */}
        <ProductCarouselRow
          title="New Arrivals (Last 24h)"
          products={newArrivals}
          filterUrl="/products/new-arrivals"
        />

        {/* Real Estate */}
        <ProductCarouselRow
          title="Real Estate & Houses"
          products={realEstate}
          filterUrl="/products?category=real-estate"
        />

        {/* Vehicles */}
        <ProductCarouselRow
          title="Vehicles & Cars"
          products={vehicles}
          filterUrl="/products?category=vehicles"
        />

        {/* Category: Electronics */}
        <ProductCarouselRow
          title="Phone & Electronics"
          products={phoneAndElectronics}
          filterUrl="/products?category=electronics"
        />

        {/* Broker Listings */}
        <ProductCarouselRow
          title="Broker Listings"
          products={brokerItems}
          filterUrl="/brokers"
        />

        {/* Sell CTA Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
          <div className="relative rounded-[3rem] overflow-hidden bg-slate-950 p-12 md:p-20 text-center text-white">
            <div className="absolute inset-0 opacity-20">
              <img src="/market-narrative-1.png" alt="Overlay" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter">
                Start selling for free today.
              </h2>
              <p className="text-white/60 text-lg font-bold">
                Join thousands of verified sellers in Ethiopia's most professional marketplace.
              </p>
              <div className="pt-4">
                <Link href="/stores/create">
                  <Button className="h-16 px-12 bg-white text-slate-950 hover:bg-violet-600 hover:text-white font-black text-lg rounded-2xl transition-all shadow-2xl">
                    Create Your Store Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Statistics */}
      <section className="w-full py-20 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: 'Active Listings', value: '18k+' },
            { label: 'Verified Stores', value: '2.5k+' },
            { label: 'Market Growth', value: '450%' },
            { label: 'Reliability', value: '100%' }
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-black tracking-tighter mb-1 italic text-slate-950">{stat.value}</p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
