import { NextResponse } from 'next/server';
import { ProductService } from '@/lib/services/product-service';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const products = await ProductService.getStoreProducts(id);
        return NextResponse.json(products);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
