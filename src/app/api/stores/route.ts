import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/auth";
import connectDB from "@/lib/db/mongoose";
import Store from "@/lib/models/store";
import User from "@/lib/models/user";
import { slugify } from "@/lib/utils/slug";

import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const formData = await req.formData();

        const storeName = formData.get("storeName") as string;
        const requestedSlug = formData.get("storeSlug") as string;
        const description = formData.get("description") as string;
        // ... (other fields)
        const category = formData.get("category") as string;
        const phone = formData.get("phone") as string;
        const whatsapp = formData.get("whatsapp") as string;
        const telegram = formData.get("telegram") as string;
        const address = formData.get("address") as string;
        const sellerName = formData.get("sellerName") as string;
        const city = formData.get("city") as string;
        const country = formData.get("country") as string;

        const logoFile = formData.get("logo") as File | null;
        const coverFile = formData.get("coverImage") as File | null;

        // Check if user already has a store
        const existingStore = await Store.findOne({ ownerId: session.user.id });
        if (existingStore) {
            return NextResponse.json({ error: "You already have a store" }, { status: 400 });
        }

        // Handle Image Uploads
        let logo = undefined;
        let coverImage = undefined;

        if (logoFile && logoFile.size > 0) {
            const buffer = Buffer.from(await logoFile.arrayBuffer());
            const dataUri = `data:${logoFile.type};base64,${buffer.toString("base64")}`;
            logo = await uploadImage(dataUri, "logos");
        }

        if (coverFile && coverFile.size > 0) {
            const buffer = Buffer.from(await coverFile.arrayBuffer());
            const dataUri = `data:${coverFile.type};base64,${buffer.toString("base64")}`;
            coverImage = await uploadImage(dataUri, "covers");
        }

        // Handle Slug Generation/Validation
        let storeSlug = requestedSlug ? slugify(requestedSlug) : slugify(storeName);

        if (!storeSlug) {
            return NextResponse.json({ error: "Invalid store name or slug" }, { status: 400 });
        }

        // Ensure uniqueness of slug
        const slugExists = await Store.findOne({ storeSlug });
        if (slugExists) {
            if (requestedSlug) {
                return NextResponse.json({ error: "This custom URL is already taken. Please choose another." }, { status: 400 });
            }

            // If it was auto-generated and exists, add a suffix
            let counter = 1;
            let uniqueSlug = storeSlug;
            while (await Store.findOne({ storeSlug: uniqueSlug })) {
                uniqueSlug = `${storeSlug}-${counter}`;
                counter++;
            }
            storeSlug = uniqueSlug;
        }

        const newStore = await Store.create({
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
            city: city || "Addis Ababa",
            country: country || "Ethiopia",
            status: "approved",
            logo,
            coverImage
        });

        // Update user role to seller
        await User.findByIdAndUpdate(session.user.id, { role: "seller" });

        return NextResponse.json({ success: true, store: newStore }, { status: 201 });
    } catch (error: any) {
        console.error("STORE_CREATION_ERROR:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const store = await Store.findOne({ ownerId: session.user.id });

        return NextResponse.json({ store });
    } catch (error: any) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
