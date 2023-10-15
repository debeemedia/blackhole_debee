
const mongoose = require('mongoose')
const Products = require('./product_model')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
})

categorySchema.pre('findByIdAndDelete', async function (next) {
    category = this
    Products.deleteMany({category: category._id})
    next()
})

module.exports.CategoryModel = mongoose.model('category', categorySchema)