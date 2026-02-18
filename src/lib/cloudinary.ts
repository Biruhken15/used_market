import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
});

export const uploadImage = async (file: string, folder: string) => {
    try {
        console.log('--- Cloudinary Upload Start ---');
        console.log('Current System Time (UTC):', new Date().toISOString());
        console.log('Cloud Name Present:', !!process.env.CLOUDINARY_CLOUD_NAME);

        const result = await cloudinary.uploader.upload(file, {
            folder: `ethio-market/${folder}`,
            resource_type: 'auto',
        });

        console.log('--- Cloudinary Upload Success ---');
        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error: any) {
        console.error('--- Cloudinary Upload Failure ---');
        console.error('Cloudinary Error Detail:', JSON.stringify(error, null, 2));
        throw new Error('Image upload failed');
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
