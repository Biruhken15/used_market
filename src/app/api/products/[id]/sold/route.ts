import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils/auth';
import { ProductService } from '@/lib/services/product-service';

/**
 * PATCH: Mark product as sold
 */
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const result = await ProductService.markAsSold(
            id,
            (session.user as any).id
        );

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("[ProductSoldAPI] Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to mark as sold" },
            { status: 500 }
        );
    }
}
