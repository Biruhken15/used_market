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
    sourceOwner?: {
        name?: string;
        phone?: string;
        address?: string;
        otherInfo?: string;
    };
    createdAt: Date;
    updatedAt: Date;
    isUrgent: boolean;
    isFeatured: boolean;
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

    // Media - with dynamic plan limits (enforced in service)
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
        }]
    },

    // Thumbnail
    thumbnail: {
        type: String,
        required: [false, 'Thumbnail is required'] // Generated in pre-save hook
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
    },

    // Broker info: Source Owner (Hidden from public)
    sourceOwner: {
        name: { type: String, trim: true },
        phone: { type: String, trim: true },
        telegram: { type: String, trim: true },
        address: { type: String, trim: true },
        otherInfo: { type: String, trim: true }
    },

    // Promotional flags
    isUrgent: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Hooks
productSchema.pre('save', function (next) {
    const product = this as any;

    // Auto-set thumbnail from images if missing
    if (product.images && product.images.length > 0 && !product.thumbnail) {
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
