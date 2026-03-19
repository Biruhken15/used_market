import { ProductService } from "@/lib/services/product-service";
import { ProductCard } from "@/components/dashboard/product-card";
import { FeatureBar } from "@/components/home/FeatureBar";

export default async function NewArrivalsPage() {
    const products = await ProductService.getMarketplaceProducts({ last24Hours: true }, 1, 50);

    return (
        <div className="min-h-screen bg-slate-100 pt-28">
            <FeatureBar />
            <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase">
                            New Arrivals 🕒
                        </h1>
                        <p className="text-slate-500 font-bold">
                            Fresh listings posted in the last 24 hours.
                        </p>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {products.map((product: any) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-20 text-center border border-slate-200">
                            <p className="text-slate-400 font-bold text-xl">No new arrivals in the last 24 hours.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
