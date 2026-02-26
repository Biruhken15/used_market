import { uploadFromBuffer } from "../cloudinary";

export class UploadService {
    static async uploadFile(file: File, folder: string) {
        try {
            // Validation
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                throw new Error(`File "${file.name}" is too large. Max size is 5MB.`);
            }

            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                throw new Error(`File "${file.name}" has an invalid format (${file.type}). Allowed: JPG, PNG, WEBP, GIF.`);
            }

            const buffer = Buffer.from(await file.arrayBuffer());

            console.log(`[UploadService] Starting upload for ${file.name} to folder ${folder}...`);

            const result = await uploadFromBuffer(buffer, folder);

            console.log(`[UploadService] Upload successful for ${file.name}:`, result.url);

            return result;
        } catch (error: any) {
            console.error(`[UploadService] Failed to upload ${file.name}:`, error);

            // Provide more descriptive errors based on Cloudinary response if available
            if (error.http_code === 401) {
                throw new Error("Cloudinary authentication failed. Please check your API credentials.");
            }
            if (error.http_code === 400 && error.message?.includes("Stale request")) {
                throw new Error("Cloudinary request expired (Stale request). This usually happens if your system clock is incorrect.");
            }

            throw new Error(error.message || `Failed to upload image ${file.name}`);
        }
    }
}
