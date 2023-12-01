const mongoose = require('mongoose')
const Favorites = require('./favourite.model')
const { ReviewModel } = require('./review.model')
const { FlashModel } = require('./flashSale.model')

const productSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor',
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        images: [{
            type: String,
            required: true,
            min: [1,'add more images'],
            max: 5,
            default: 'https://pic.onlinewebfonts.com/thumbnails/icons_90947.svg'
        }],
        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        }
    }, {timestamps: true}
)

// Create text indexes (for search) // NB: must also be set up on atlas
productSchema.index({ name: 'text', description: 'text' });

const ProductModel = mongoose.model('Product', productSchema)

module.exports = ProductModel