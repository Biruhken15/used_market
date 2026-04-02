export const dynamic = 'force-dynamic';

import { ProductService } from "@/lib/services/product-service";
import { ProductCard } from "@/components/dashboard/product-card";
import { FeatureBar } from "@/components/home/FeatureBar";
import { Pagination } from "@/components/ui/pagination";
import { ProductSearch } from "@/components/common/ProductSearch";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Sparkles, Trophy, Zap, Star, Package } from "lucide-react";

export default async function AllProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ 
        page?: string, 
        category?: string, 
        region?: string, 
        minPrice?: string, 
        maxPrice?: string,
        q?: string 
    }>;
}) {
    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const limit = 10; // Forced to 10 items per page as requested
    
    // Construct filter object from query params
    const filters: any = {};
    if (params.category) filters.category = params.category;
    if (params.region) filters.region = params.region;
    if (params.minPrice) filters.minPrice = params.minPrice;
    if (params.maxPrice) filters.maxPrice = params.maxPrice;
    if (params.q) filters.keyword = params.q;

    const { products, total, totalPages } = await ProductService.getMarketplaceProducts(filters, page, limit);

    return (
        <div className="min-h-screen bg-slate-50/50 pt-32">
            <FeatureBar />
            
            {/* SEARCH SECTION - Dedicated and compact */}
            <section className="bg-white border-b border-slate-100 py-10 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <div className="space-y-1">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-950 italic tracking-tighter uppercase leading-none">
                            Discover Used Products
                        </h2>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px]">Verify, Buy, Sell & Scale</p>
                    </div>
                    <ProductSearch />
                </div>
            </section>

            {/* HORIZONTAL FILTERS - Now centralized and non-sidebar */}
            <ProductFilters />
            
            <main className="max-w-[1600px] mx-auto px-4 md:px-10 pb-24">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black text-slate-950 italic tracking-tighter uppercase leading-none">
                                {params.category ? `${params.category}` : 'Marketplace'}
                            </h1>
                            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest opacity-60">
                                {total} Listings Available
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                Page {page} of {totalPages || 1}
                            </p>
                        </div>
                    </div>

                    {/* Products Grid - 5 COLUMNS ON LARGE SCREENS */}
                    {products && products.length > 0 ? (
                        <div className="space-y-12">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {products.map((product: any) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                            
                            {/* Pagination */}
                            <div className="pt-12 border-t border-slate-100">
                                <Pagination currentPage={page} totalPages={totalPages} />
                            </div>
                        </div>
                    ) : (
                        <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                            <Package className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                            <h3 className="text-xl font-black text-slate-950 tracking-tighter italic uppercase">No items found</h3>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Try adjusting your filters or search keywords.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
