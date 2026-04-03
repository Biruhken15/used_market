import { ProductService } from "@/lib/services/product-service";
import { ProductCarouselRow } from "@/components/home/ProductCarouselRow";

export async function PromotedRow() {
    const { products } = await ProductService.getMarketplaceProducts({ hasPromotedPlan: true }, 1, 10);
    if (products.length === 0) return null;
    return (
        <ProductCarouselRow
            title="Promoted Stores"
            products={products}
            filterUrl="/products?promoted=true"
        />
    );
}

export async function FeaturedRow() {
    const { products } = await ProductService.getMarketplaceProducts({ isFeatured: true }, 1, 10);
    return (
        <ProductCarouselRow
            title="Featured Products"
            products={products}
            filterUrl="/products/featured"
        />
    );
}

export async function UrgentRow() {
    const { products } = await ProductService.getMarketplaceProducts({ isUrgent: true }, 1, 10);
    return (
        <ProductCarouselRow
            title="Urgent Deals ⚡"
            products={products}
            filterUrl="/products/urgent"
        />
    );
}

export async function NewArrivalsRow() {
    const { products } = await ProductService.getMarketplaceProducts({ last24Hours: true }, 1, 10);
    return (
        <ProductCarouselRow
            title="New Arrivals (Last 24h)"
            products={products}
            filterUrl="/products/new-arrivals"
        />
    );
}

export async function CategoryRow({ title, category }: { title: string, category: string }) {
    const { products } = await ProductService.getMarketplaceProducts({ category }, 1, 10);
    return (
        <ProductCarouselRow
            title={title}
            products={products}
            filterUrl={`/products?category=${category}`}
        />
    );
}

export async function BrokerRow() {
    // This now works correctly thanks to ProductService update
    const { products } = await ProductService.getMarketplaceProducts({ 'store.storeType': 'broker' }, 1, 10);
    return (
        <ProductCarouselRow
            title="Verified Agent Portfolios"
            products={products}
            filterUrl="/brokers"
        />
    );
}
