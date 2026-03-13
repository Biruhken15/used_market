import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
    // Who owns this store
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true  // One store per user
    },

    // Store identity
    storeName: {
        type: String,
        required: true
    },
    storeSlug: {
        type: String,
        required: true,
        unique: true  // For URL: mystore.usedmarket.com
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: [String],
        required: true  // [Electronics, Phones]
    },

    // Approval status - DEFAULT APPROVED
    status: {
        type: String,
        enum: ['approved', 'rejected'],  // Only approved or rejected
        default: 'approved'  // Auto-approved by default
    },

    // Contact
    phone: {
        type: String,
        required: true
    },
    whatsapp: {
        type: String  // Optional WhatsApp number
    },
    telegram: {
        type: String  // Optional Telegram username or link
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    city: String,
    country: String,

    // Identity Verification
    idType: {
        type: String,
        enum: ['National ID', 'Kebele ID', 'Driver License', 'Passport'],
        required: true
    },
    idFront: {
        url: String,
        publicId: String
    },
    idBack: {
        url: String,
        publicId: String
    },

    // Multiple Locations (Enterprise Only)
    locations: [{
        city: String,
        address: String,
        phone: String
    }],

    // Seller info
    sellerName: {
        type: String,
        required: true
    },  // Legal name

    // Media
    logo: {
        url: String,
        publicId: String
    },
    coverImage: {
        url: String,
        publicId: String
    },

    // Staff Management
    staff: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        email: String,
        role: { type: String, enum: ['manager', 'editor'], default: 'editor' },
        addedAt: { type: Date, default: Date.now }
    }],

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp on save
storeSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Store = mongoose.models.Store || mongoose.model('Store', storeSchema);

export default Store;
