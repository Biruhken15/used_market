"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/auth";
import { revalidatePath } from "next/cache";
import dbConnect from "../db/mongoose";
import Review from "../models/review";
import Store from "../models/store";

export type ActionState = {
    success?: boolean;
    error?: string;
    details?: string;
};

/**
 * Action to submit a review for a store.
 */
export async function submitStoreReviewAction(formData: FormData): Promise<ActionState> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return { error: "Unauthorized", details: "You must be logged in to leave a review." };
        }

        await dbConnect();

        const storeId = formData.get("storeId") as string;
        const rating = parseInt(formData.get("rating") as string);
        const comment = formData.get("comment") as string;

        if (!storeId || !rating || !comment) {
            return { error: "Missing required fields" };
        }

        const store = await Store.findById(storeId);
        if (!store) return { error: "Store not found" };

        // Prevent owner from reviewing their own store
        if (store.ownerId.toString() === session.user.id) {
            return { error: "Action Denied", details: "You cannot review your own store." };
        }

        // Check if user already reviewed this store
        const existingReview = await Review.findOne({ storeId, userId: session.user.id });
        if (existingReview) {
            return { error: "Already Reviewed", details: "You have already left a review for this store." };
        }

        await Review.create({
            storeId,
            userId: session.user.id,
            rating,
            comment,
            status: 'approved'
        });

        // Revalidate the store public page and any other relevant paths
        revalidatePath(`/stores/${store.storeSlug}`);

        return { success: true };
    } catch (error: any) {
        console.error("[submitStoreReviewAction] Error:", error);
        return { error: "Failed to submit review", details: error.message };
    }
}

/**
 * Action to delete a store review.
 */
export async function deleteStoreReviewAction(reviewId: string): Promise<ActionState> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) return { error: "Unauthorized" };

        await dbConnect();

        const review = await Review.findById(reviewId).populate('storeId');
        if (!review) return { error: "Review not found" };

        if (review.userId.toString() !== session.user.id) {
            return { error: "Forbidden" };
        }

        await Review.findByIdAndDelete(reviewId);

        revalidatePath(`/stores/${(review.storeId as any).storeSlug}`);
        return { success: true };
    } catch (error: any) {
        return { error: "Deletion Failed", details: error.message };
    }
}
