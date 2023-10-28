
const mongoose = require('mongoose')
const Products = require('./product.model')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
})

categorySchema.pre('findByIdAndDelete', async function (next) {
    category = this
    Products.deleteMany({category: category._id})
    next()
})

module.exports.CategoryModel = mongoose.model('Category', categorySchema)