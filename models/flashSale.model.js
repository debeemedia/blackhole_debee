
const mongoose = require('mongoose')

const flashSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    new_price: {
        type: Number,
        required: true
    }
})

const FlashModel = mongoose.model('Flash', flashSchema)
module.exports = {FlashModel}