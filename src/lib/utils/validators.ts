import { z } from 'zod';

/**
 * Zod Schemas for Production Validation
 * Ensures data integrity for 1M+ users and 40k+ stores.
 */

// Product Validation Schema
export const ProductSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100),
    description: z.string().min(10, "Description must be at least 10 characters").max(2000),
    price: z.number().min(0, "Price must be positive"),
    category: z.string().min(1, "Category is required"),
    condition: z.enum(['new', 'like-new', 'good', 'fair', 'for-parts']),
    priceType: z.enum(['fixed', 'negotiable']),
    images: z.array(z.object({
        url: z.string().url(),
        publicId: z.string()
    })).min(1, "At least one image is required"),
    city: z.string().optional(),
    region: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

// Store Validation Schema
export const StoreSchema = z.object({
    storeName: z.string().min(3, "Store name must be at least 3 characters").max(50),
    sellerName: z.string().min(2, "Seller name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters").max(1000),
    category: z.array(z.string()).min(1, "Select at least one category"),
    phone: z.string().min(10, "Valid phone number required"),
    email: z.string().email("Invalid email address"),
    city: z.string().min(2, "City is required"),
    address: z.string().min(5, "Address is required"),
    idType: z.string().min(1, "ID Type is required"),
    storeType: z.enum(['standard', 'broker']).optional().default('standard'),
    whatsapp: z.string().optional(),
    telegram: z.string().optional(),
    logo: z.object({
        url: z.string().url(),
        publicId: z.string()
    }).optional(),
});
