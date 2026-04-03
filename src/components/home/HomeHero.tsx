import { ProductService } from "@/lib/services/product-service";
import { PromoCarousel } from "./PromoCarousel";
import { HomeHeroFilters } from "./HomeHeroFilters";

export async function HomeHero() {
    const { products: promotedProducts } = await ProductService.getMarketplaceProducts({ hasPromotedPlan: true }, 1, 5);
    
    return (
        <section className="max-w-6xl mx-auto w-full px-4 md:px-8 py-4">
            <div className="flex flex-col-reverse lg:grid lg:grid-cols-4 gap-6">
                {/* Left: Sidebar Filters (Desktop only) */}
                <div className="hidden lg:block lg:col-span-1 h-full">
                    <HomeHeroFilters />
                </div>

                {/* Right: Promotional Carousel */}
                <div className="lg:col-span-3">
                    <div className="h-full rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-sm bg-white border border-slate-200">
                        <PromoCarousel initialProducts={promotedProducts} />
                    </div>
                </div>
            </div>

            {/* Mobile Quick Filters Button */}
            <div className="lg:hidden mt-4">
                <HomeHeroFilters isMobile={true} />
            </div>
        </section>
    );
}

export function HomeHeroSkeleton() {
    return (
        <section className="max-w-6xl mx-auto w-full px-4 md:px-8 py-4">
            <div className="flex flex-col-reverse lg:grid lg:grid-cols-4 gap-6">
                <div className="hidden lg:block lg:col-span-1 h-[400px] bg-white rounded-[2.5rem] animate-pulse border border-slate-100" />
                <div className="lg:col-span-3 h-[400px] bg-slate-200 rounded-[2.5rem] animate-pulse" />
            </div>
        </section>
    );
}
