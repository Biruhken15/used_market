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
    return new Promise((resolve, reject) => {
        const options: any = {
            folder: `ethio-market/${folder}`,
            resource_type: 'auto',
        };

        if (timestamp) {
            options.timestamp = timestamp;
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            options,
            (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                if (error) {
                    console.error('Cloudinary Stream Upload Error:', error);
                    return reject(error);
                }
                if (!result) {
                    return reject(new Error('Cloudinary upload resulting in empty response'));
                }
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                });
            }
        );

        uploadStream.end(buffer);
    });
};

export const deleteImage = async (publicId: string) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary Delete Error:', error);
    }
};

export default cloudinary;
