const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    street_address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    postal_code: {
        type: Number
    },
    phone_number: {
        type: String,
        required: true
    },
    alternate_phone_number: {
        type: Number
    },
    product_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }],
    order_date: {
        type: Date
    },
    delivery_date: {
        type: Date
    },
    completed: {
        type: Boolean,
        default: false
    }
})

const OrderModel = mongoose.model('Order', orderSchema)
module.exports = OrderModel
