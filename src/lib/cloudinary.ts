import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
});

export const uploadImage = async (file: string, folder: string) => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: `Used-Store-Images/${folder}`,
            resource_type: 'auto',
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error: any) {
        console.error('Cloudinary Upload Error:', error);
        throw error;
    }
};

export const uploadFromBuffer = async (
    buffer: Buffer,
    folder: string,
    timestamp?: number
): Promise<{ url: string; publicId: string }> => {
    try {
        // Convert buffer to Base64 data URI
        const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;

        const options: any = {
            folder: `ethio-market/${folder}`,
            resource_type: 'auto',
        };

        if (timestamp) {
            options.timestamp = timestamp;
        }

        const result = await cloudinary.uploader.upload(base64Image, options);

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error: any) {
        console.error('Cloudinary Upload Error:', error);
        throw error;
    }
};

export const deleteImage = async (publicId: string) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary Delete Error:', error);
    }
};

export default cloudinary;
