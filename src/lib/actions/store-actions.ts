"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/auth";
import { StoreService, StoreData } from "../services/store-service";
import { UploadService } from "../services/upload-service";
import { revalidatePath } from "next/cache";

export type ActionState = {
    success?: boolean;
    error?: string;
    details?: string;
};

export async function createStoreAction(formData: FormData): Promise<ActionState> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return { error: "Unauthorized", details: "You must be logged in to create a store." };
        }

        const logoFile = formData.get("logo") as File | null;
        const coverFile = formData.get("coverImage") as File | null;

        // Handle Image Uploads
        let logo = undefined;
        let coverImage = undefined;

        if (logoFile && logoFile.size > 0) {
            try {
                logo = await UploadService.uploadFile(logoFile, "logos");
            } catch (err: any) {
                return { error: "Logo Upload Failed", details: err.message };
            }
        }

        if (coverFile && coverFile.size > 0) {
            try {
                coverImage = await UploadService.uploadFile(coverFile, "covers");
            } catch (err: any) {
                return { error: "Cover Image Upload Failed", details: err.message };
            }
        }

        const storeName = formData.get("storeName") as string;
        const storeSlug = (formData.get("storeSlug") as string).toLowerCase();
        const description = formData.get("description") as string;
        const category = formData.getAll("category") as string[];
        const phone = formData.get("phone") as string;
        const whatsapp = formData.get("whatsapp") as string;
        const telegram = formData.get("telegram") as string;
        const address = formData.get("address") as string;
        const sellerName = formData.get("sellerName") as string;
        const city = formData.get("city") as string;
        const country = formData.get("country") as string;

        const storeData: StoreData = {
            ownerId: session.user.id,
            storeName,
            storeSlug,
            description,
            category,
            phone,
            whatsapp,
            telegram,
            address,
            sellerName,
            city,
            country,
            logo,
            coverImage
        };

        await StoreService.createStore(storeData);

        revalidatePath("/dashboard");
        revalidatePath("/stores");

        return { success: true };
    } catch (error: any) {
        console.error("[createStoreAction] Error:", error);
        return {
            error: "Store Creation Failed",
            details: error.message || "An unexpected error occurred while creating your store."
        };
    }
}
