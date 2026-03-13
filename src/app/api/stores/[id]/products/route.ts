import { NextResponse } from 'next/server';
import { ProductService } from '@/lib/services/product-service';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const products = await ProductService.getStoreProducts(params.id);
        return NextResponse.json(products);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
