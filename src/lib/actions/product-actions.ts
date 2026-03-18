"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/auth";
import { ProductService } from "../services/product-service";
import { UploadService } from "../services/upload-service";
import { revalidatePath } from "next/cache";

export type ActionState = {
    success?: boolean;
    error?: string;
    details?: string;
    productId?: string;
};

export async function createProductAction(formData: FormData): Promise<ActionState> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return { error: "Unauthorized", details: "You must be logged in to post a listing." };
        }

        const storeId = formData.get("storeId") as string;
        let storeSlug = formData.get("storeSlug") as string || "personal";

        // storeId can be null for Pay-Per-Product flow

        // 1. Enforce Server-Side Multi-Image Limits
        const imageFiles = formData.getAll("images") as File[];

        if (storeId) {
            const { SubscriptionService } = await import("../services/subscription-service");
            const imageCheck = await SubscriptionService.validateImageCount(storeId, imageFiles.length);

            if (!imageCheck.allowed) {
                return { error: "Limit Exceeded", details: imageCheck.reason };
            }
        }

        const uploadedImages: any[] = [];

        for (const file of imageFiles) {
            if (file && file.size > 0 && typeof file !== 'string') {
                try {
                    // Organization: products/[store-slug]/[file]
                    const uploadResult = await UploadService.uploadFile(file, `products/${storeSlug || 'personal'}`);
                    uploadedImages.push({
                        url: uploadResult.url,
                        publicId: uploadResult.publicId,
                        isPrimary: uploadedImages.length === 0 // First image is primary
                    });
                } catch (err: any) {
                    return { error: "Image Upload Failed", details: err.message };
                }
            }
        }

        if (uploadedImages.length === 0) {
            return { error: "Images Required", details: "Please upload at least one image of your product." };
        }

        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const price = Number(formData.get("price"));
        const priceType = formData.get("priceType") as 'fixed' | 'negotiable';
        const category = formData.get("category") as any;
        const condition = formData.get("condition") as any;
        const quantity = Number(formData.get("quantity") || 1);
        const isFeatured = formData.get("isFeatured") === "true";
        const isUrgent = formData.get("isUrgent") === "true";

        // Determine status: if it's Solo Flow (no active sub for this specific product yet), it might be pending
        // But for simplicity, we let the service handle status and just pass the flag.
        // Actually, the user wants status: 'pending' if in Solo flow.

        // Check if user has active sub to determine initial status
        let initialStatus: 'active' | 'pending' = 'active';
        if (storeId) {
            const { SubscriptionService } = await import("../services/subscription-service");
            const sub = await SubscriptionService.getStoreSubscription(storeId);
            if (!sub || sub.status !== 'active') {
                initialStatus = 'pending';
            }
        } else {
            initialStatus = 'pending';
        }

        const product = await ProductService.createProduct({
            title,
            description,
            price,
            priceType,
            category,
            condition,
            quantity,
            isFeatured,
            isUrgent,
            status: initialStatus,
            storeId: storeId as any,
            ownerId: session.user.id as any,
            images: uploadedImages,
            sourceOwner: {
                name: formData.get("sourceOwnerName") as string,
                phone: formData.get("sourceOwnerPhone") as string,
                telegram: formData.get("sourceOwnerTelegram") as string,
                address: formData.get("sourceOwnerAddress") as string,
                otherInfo: formData.get("sourceOwnerOtherInfo") as string,
            }
        });

        revalidatePath("/seller/mystore");
        revalidatePath("/products");

        return { success: true, productId: (product as any)._id.toString() };
    } catch (error: any) {
        console.error("[createProductAction] Error:", error);
        return {
            error: "Listing Creation Failed",
            details: error.message || "An unexpected error occurred."
        };
    }
}

export async function updateProductAction(formData: FormData): Promise<ActionState> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return { error: "Unauthorized" };
        }

        const productId = formData.get("productId") as string;
        const storeId = formData.get("storeId") as string;
        const storeSlug = formData.get("storeSlug") as string || "general";

        if (!productId) {
            return { error: "Missing Product ID", details: "Could not identify the listing to update." };
        }

        const uploadedImages: any[] = [];
        const imageFiles = formData.getAll("images") as File[];

        // Handle new images if any
        for (const file of imageFiles) {
            if (file && file.size > 0 && typeof file !== 'string') {
                try {
                    const uploadResult = await UploadService.uploadFile(file, `products/${storeSlug}`);
                    uploadedImages.push({
                        url: uploadResult.url,
                        publicId: uploadResult.publicId,
                        isPrimary: uploadedImages.length === 0
                    });
                } catch (err: any) {
                    return { error: "Image Upload Failed", details: err.message };
                }
            }
        }

        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const price = Number(formData.get("price"));
        const priceType = formData.get("priceType") as 'fixed' | 'negotiable';
        const category = formData.get("category") as any;
        const condition = formData.get("condition") as any;
        const quantity = Number(formData.get("quantity") || 1);
        const isFeatured = formData.get("isFeatured") === "true";
        const isUrgent = formData.get("isUrgent") === "true";

        const updateData: any = {
            title,
            description,
            price,
            priceType,
            category,
            condition,
            quantity,
            isFeatured,
            isUrgent,
            sourceOwner: {
                name: formData.get("sourceOwnerName") as string,
                phone: formData.get("sourceOwnerPhone") as string,
                telegram: formData.get("sourceOwnerTelegram") as string,
                address: formData.get("sourceOwnerAddress") as string,
                otherInfo: formData.get("sourceOwnerOtherInfo") as string,
            }
        };

        if (uploadedImages.length > 0) {
            updateData.images = uploadedImages;
            updateData.thumbnail = uploadedImages[0].url;
        }

        await ProductService.updateProduct(productId, session.user.id, updateData);

        revalidatePath("/dashboard");
        revalidatePath("/seller/mystore");
        revalidatePath(`/products/${productId}`);

        return { success: true };
    } catch (error: any) {
        console.error("[updateProductAction] Error:", error);
        return {
            error: "Update Failed",
            details: error.message || "An unexpected error occurred."
        };
    }
}
