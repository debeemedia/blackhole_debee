const mongoose = require('mongoose')

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
        image: {
            type: String,
            required: true,
            min: [1,'add more images'],
            max: 5,
            default: 'https://pic.onlinewebfonts.com/thumbnails/icons_90947.svg'
        },
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

const ProductModel = mongoose.model('Product', productSchema)

module.exports = ProductModel