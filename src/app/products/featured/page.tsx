export const dynamic = 'force-dynamic';

import { ProductService } from "@/lib/services/product-service";
import { ProductCard } from "@/components/dashboard/product-card";
import { FeatureBar } from "@/components/home/FeatureBar";
import { Pagination } from "@/components/ui/pagination";

export default async function FeaturedProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const limit = 10;

    const { products, total, totalPages } = await ProductService.getMarketplaceProducts({ isFeatured: true }, page, limit);

    return (
        <div className="min-h-screen bg-slate-100 pt-28">
            <FeatureBar />
            <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase">
                            Featured Products ⭐
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                            Curated Premium Items • {total} Listings
                        </p>
                    </div>

                    {products && products.length > 0 ? (
                        <div className="space-y-12">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {products.map((product: any) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                            
                            <div className="pt-8 border-t border-slate-200">
                                <Pagination currentPage={page} totalPages={totalPages} />
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-20 text-center border border-slate-200">
                            <p className="text-slate-400 font-bold text-xl">No featured products found right now.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
