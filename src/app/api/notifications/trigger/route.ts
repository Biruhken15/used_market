import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/auth";
import { NotificationService } from "@/lib/services/notification-service";
import dbConnect from "@/lib/db/mongoose";
import Product from "@/lib/models/product";
import Store from "@/lib/models/store";

import { rateLimit } from "@/lib/utils/rate-limiter";

export async function POST(req: Request) {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const limiter = rateLimit(ip, 10, 60000); // 10 requests per minute

    if (!limiter.success) {
        return NextResponse.json(
            { message: "Too many requests. Please try again later." },
            { 
                status: 429,
                headers: {
                    'X-RateLimit-Limit': '10',
                    'X-RateLimit-Remaining': limiter.remaining.toString(),
                    'X-RateLimit-Reset': limiter.reset.toString()
                }
            }
        );
    }

    try {
        const session = await getServerSession(authOptions);
        const { type, productId, storeId: targetStoreId } = await req.json();

        await dbConnect();

        let recipientId: string | null = null;
        let title = "";
        let message = "";
        let finalStoreId = targetStoreId;

        if (type === 'product_viewed' || type === 'product_shared') {
            const product = await Product.findById(productId).populate('storeId');
            if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });
            
            recipientId = (product.storeId as any).ownerId.toString();
            finalStoreId = (product.storeId as any)._id.toString();
            
            // Don't notify if the owner is viewing/sharing their own product
            if (session?.user?.id === recipientId) {
                return NextResponse.json({ message: "Self-notification skipped" });
            }

            if (type === 'product_viewed') {
                title = "Product Viewed";
                message = `Someone just viewed your product: ${product.title}`;
            } else {
                title = "Product Shared";
                message = `Someone shared your product: ${product.title}`;
            }
        } else if (type === 'store_visited') {
            const store = await Store.findById(targetStoreId);
            if (!store) return NextResponse.json({ message: "Store not found" }, { status: 404 });
            
            recipientId = store.ownerId.toString();
            
            if (session?.user?.id === recipientId) {
                return NextResponse.json({ message: "Self-notification skipped" });
            }

            title = "Store Visited";
            message = `Someone just visited your store profile!`;
        }

        if (recipientId) {
            await NotificationService.create({
                userId: recipientId,
                storeId: finalStoreId,
                type,
                title,
                message,
                metadata: { productId }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Notification Trigger Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
