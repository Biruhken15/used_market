import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    title: string;
    slug: string;
    description: string;
    price: number;
    priceType: 'fixed' | 'negotiable';
    category: 'electronics' | 'phones' | 'real-estate' | 'vehicles' | 'houses' | 'furniture' | 'fashion' | 'sports' | 'books' | 'other';
    condition: 'new' | 'like-new' | 'good' | 'fair' | 'for-parts';
    status: 'active' | 'sold' | 'pending' | 'archived';
    quantity: number;
    storeId: mongoose.Types.ObjectId;
    ownerId: mongoose.Types.ObjectId;
    images: Array<{
        url: string;
        publicId: string;
        isPrimary?: boolean;
    }>;
    thumbnail: string;
    features: Map<string, any>;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
    // Identity
    title: {
        type: String,
        required: [true, 'Product title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [5000, 'Description cannot exceed 5000 characters']
    },

    // Pricing
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },

    priceType: {
        type: String,
        enum: ['fixed', 'negotiable'],
        required: true,
        default: 'fixed'
    },

    // Classification
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['electronics', 'phones', 'real-estate', 'vehicles', 'houses', 'furniture', 'fashion', 'sports', 'books', 'other']
    },

    condition: {
        type: String,
        enum: ['new', 'like-new', 'good', 'fair', 'for-parts'],
        required: [true, 'Condition is required']
    },

    // Status
    status: {
        type: String,
        enum: ['active', 'sold', 'pending', 'archived'],
        required: true,
        default: 'active'
    },

    quantity: {
        type: Number,
        default: 1,
        min: [1, 'Quantity must be at least 1']
    },

    // Relationships
    storeId: {
        type: Schema.Types.ObjectId,
        ref: 'Store',
        required: [true, 'Store ID is required']
    },

    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Owner ID is required']
    },

    // Media - with 5 image limit
    images: {
        type: [{
            url: {
                type: String,
                required: [true, 'Image URL is required']
            },
            publicId: {
                type: String,
                required: [true, 'Cloudinary public ID is required']
            },
            isPrimary: {
                type: Boolean,
                default: false
            }
        }],
        validate: {
            validator: function (images: any[]) {
                return images.length <= 5;
            },
            message: 'You can only upload up to 5 images per product'
        }
    },

    // Thumbnail
    thumbnail: {
        type: String,
        required: [true, 'Thumbnail is required']
    },

    // Dynamic Attributes
    features: {
        type: Map,
        of: Schema.Types.Mixed,
        default: {}
    },

    // Metrics
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Hooks
productSchema.pre('save', function (next) {
    const product = this as any;

    // Auto-generate slug if title changed or slug missing
    if (!product.slug || product.isModified('title')) {
        product.slug = product.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
            + '-' + Date.now().toString(36);
    }

    // Auto-set thumbnail from images
    if (product.images && product.images.length > 0) {
        const primaryImage = product.images.find((img: any) => img.isPrimary);
        product.thumbnail = primaryImage
            ? primaryImage.url
            : product.images[0].url;
    }

    next();
});

// Ensure only one primary image
productSchema.pre('save', function (next) {
    const product = this as any;
    if (product.images && product.images.length > 1) {
        const primaryCount = product.images.filter((img: any) => img.isPrimary).length;
        if (primaryCount > 1) {
            let foundFirst = false;
            product.images.forEach((img: any) => {
                if (!foundFirst && img.isPrimary) {
                    foundFirst = true;
                } else if (img.isPrimary) {
                    img.isPrimary = false;
                }
            });
        }
    }
    next();
});

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default Product;
