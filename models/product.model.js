const Mongoose = require('mongoose')

const productSchema = new Mongoose.Schema(
    {
        name: {
            type: String,
            required: true
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
        category: {
            type: Mongoose.Schema.Types.ObjectId,
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        }
    }, {timestamps: true}
) 

const ProductModel = Mongoose.model('Product', productSchema)

module.exports = ProductModel