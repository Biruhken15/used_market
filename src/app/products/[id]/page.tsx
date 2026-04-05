import { Metadata } from 'next';
import { ProductService } from '@/lib/services/product-service';
import ProductDetailsClient from './product-details-client';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

/**
 * Dynamic SEO for Product Pages using Next.js generateMetadata
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const product = await ProductService.getProductById(id);

    if (!product) {
        return {
            title: 'Product Not Found | Used Market',
            description: 'The requested product could not be found.'
        };
    }

    return {
        title: `${product.title} | ${product.category} | Used Market Ethiopia`,
        description: product.description.substring(0, 160),
        openGraph: {
            title: product.title,
            description: product.description.substring(0, 160),
            images: product.images?.[0]?.url ? [{ url: product.images[0].url }] : [],
            type: 'website',
        },
    };
}

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/utils/auth';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: PageProps) {
    const { id } = await params;
    const product = await ProductService.getProductById(id) as any;

    if (!product) {
        notFound();
    }

    // Role-based Confidentiality: Only the store owner or listing creator can see the source data
    const session = await getServerSession(authOptions);
    const isOwner = session?.user && (
        product.ownerId === (session.user as any).id || 
        product.storeId?.ownerId === (session.user as any).id
    );

    if (!isOwner) {
        // Strip sensitive metadata before passing to client
        delete product.sourceOwner;
    }

    return <ProductDetailsClient product={product} />;
}
