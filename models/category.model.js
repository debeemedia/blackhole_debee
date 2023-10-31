
const mongoose = require('mongoose')
const Products = require('./product.model')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

categorySchema.pre('findByIdAndDelete', async function (next) {
    category = this
    Products.deleteMany({category: category._id})
    next()
})

const CategoryModel = mongoose.model('Categories', categorySchema)
module.exports = CategoryModel