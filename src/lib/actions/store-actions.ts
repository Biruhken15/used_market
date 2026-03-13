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
        const idFrontFile = formData.get("idFront") as File | null;
        const idBackFile = formData.get("idBack") as File | null;

        // Handle Image Uploads
        let logo = undefined;
        let coverImage = undefined;
        let idFront = undefined;
        let idBack = undefined;

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

        if (idFrontFile && idFrontFile.size > 0) {
            try {
                idFront = await UploadService.uploadFile(idFrontFile, "verification");
            } catch (err: any) {
                return { error: "ID Front Upload Failed", details: err.message };
            }
        }

        if (idBackFile && idBackFile.size > 0) {
            try {
                idBack = await UploadService.uploadFile(idBackFile, "verification");
            } catch (err: any) {
                return { error: "ID Back Upload Failed", details: err.message };
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
        const email = formData.get("email") as string;
        const sellerName = formData.get("sellerName") as string;
        const city = formData.get("city") as string;
        const country = formData.get("country") as string;
        const idType = formData.get("idType") as string;

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
            email,
            sellerName,
            city,
            country,
            idType,
            logo,
            coverImage,
            idFront,
            idBack
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

export async function updateStoreAction(formData: FormData): Promise<ActionState> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return { error: "Unauthorized", details: "You must be logged in." };
        }

        const storeId = formData.get("storeId") as string;
        if (!storeId) return { error: "Missing Store ID" };

        const updateData: any = {};

        // Basic fields
        const fields = ["storeName", "description", "phone", "whatsapp", "telegram", "address", "city"];
        fields.forEach(field => {
            const val = formData.get(field);
            if (val !== null) updateData[field] = val;
        });

        // Handle Images
        const logoFile = formData.get("logo") as File | null;
        const coverFile = formData.get("coverImage") as File | null;

        if (logoFile && logoFile.size > 0) {
            const upload = await UploadService.uploadFile(logoFile, "logos");
            updateData.logo = { url: upload.url, publicId: upload.publicId };
        }

        if (coverFile && coverFile.size > 0) {
            const upload = await UploadService.uploadFile(coverFile, "covers");
            updateData.coverImage = { url: upload.url, publicId: upload.publicId };
        }

        await StoreService.updateStore(storeId, updateData);

        revalidatePath("/seller/mystore");
        revalidatePath("/dashboard");
        revalidatePath(`/stores/${formData.get("storeSlug")}`); // Revalidate public page

        return { success: true };
    } catch (error: any) {
        console.error("[updateStoreAction] Error:", error);
        return { error: "Update Failed", details: error.message };
    }
}

export async function deleteStoreAction(storeId: string): Promise<ActionState> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return { error: "Unauthorized" };
        }

        // Verify ownership (optional but recommended)
        const store = await StoreService.getStoreByOwner(session.user.id);
        if (!store || store._id.toString() !== storeId) {
            return { error: "You don't have permission to delete this store." };
        }

        await StoreService.deleteStore(storeId);

        revalidatePath("/dashboard");
        revalidatePath("/stores");

        return { success: true };
    } catch (error: any) {
        return { error: "Deletion Failed", details: error.message };
    }
}

export async function addStaffAction(storeId: string, email: string, role: string): Promise<ActionState> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) return { error: "Unauthorized" };

        await StoreService.addStaff(storeId, email, role);
        revalidatePath("/seller/mystore");

        return { success: true };
    } catch (error: any) {
        return { error: "Failed to add staff", details: error.message };
    }
}

export async function removeStaffAction(storeId: string, userId: string): Promise<ActionState> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) return { error: "Unauthorized" };

        await StoreService.removeStaff(storeId, userId);
        revalidatePath("/seller/mystore");

        return { success: true };
    } catch (error: any) {
        return { error: "Failed to remove staff", details: error.message };
    }
}
