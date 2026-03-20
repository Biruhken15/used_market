import { ProductService } from "@/lib/services/product-service";
import { ProductCard } from "@/components/dashboard/product-card";
import { FeatureBar } from "@/components/home/FeatureBar";
import { Pagination } from "@/components/ui/pagination";

export default async function AllProductsPage({
    searchParams,
}: {
    searchParams: { 
        page?: string, 
        category?: string, 
        region?: string, 
        minPrice?: string, 
        maxPrice?: string,
        q?: string 
    };
}) {
    const page = parseInt(searchParams.page || "1");
    const limit = 10;
    
    // Construct filter object from query params
    const filters: any = {};
    if (searchParams.category) filters.category = searchParams.category;
    if (searchParams.region) filters.region = searchParams.region;
    if (searchParams.minPrice) filters.minPrice = searchParams.minPrice;
    if (searchParams.maxPrice) filters.maxPrice = searchParams.maxPrice;
    if (searchParams.q) filters.keyword = searchParams.q;

    const { products, total, totalPages } = await ProductService.getMarketplaceProducts(filters, page, limit);

    return (
        <div className="min-h-screen bg-slate-100 pt-28">
            <FeatureBar />
            
            <main className="w-full px-4 md:px-10 py-12">
                <div className="flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex flex-col gap-2">
                        <header className="pb-4">
                            <h1 className="text-3xl md:text-4xl font-black text-slate-950 italic tracking-tighter uppercase leading-none">
                                {searchParams.category ? `${searchParams.category} Products` : 'All Products'}
                            </h1>
                            <div className="flex flex-col gap-1 mt-3">
                                <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">
                                    {searchParams.region ? <span className="text-blue-600">Region: {searchParams.region} &bull; </span> : null}
                                    {(searchParams.minPrice || searchParams.maxPrice) ? (
                                        <span className="text-blue-600 uppercase">
                                            Price: {searchParams.minPrice || "0"} - {searchParams.maxPrice || "Any"} ETB &bull; {" "}
                                        </span>
                                    ) : null}
                                    Ethiopia's Premium Marketplace
                                </p>
                                <p className="text-slate-500 font-medium text-sm">
                                    Showing <span className="font-black text-slate-900">{products.length}</span> of <span className="font-black text-slate-900">{total}</span> verified listings
                                </p>
                            </div>
                        </header>
                    </div>

                    {/* Products Grid */}
                    {products && products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {products.map((product: any) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                            
                            {/* Pagination */}
                            <Pagination currentPage={page} totalPages={totalPages} />
                        </>
                    ) : (
                        <div className="bg-white rounded-3xl p-20 text-center border border-slate-200">
                            <p className="text-slate-400 font-bold text-xl uppercase tracking-tighter">No products found at the moment.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
