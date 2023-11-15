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
        type: String
    },
    products: {
        type: Array,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true,
        default: 'NGN'
    },
    order_date: {
        type: Date,
        default: Date.now()
    },
    delivery_date: {
        type: Date
    },
    completed: {
        type: Boolean,
        default: false
    },
    tx_ref: {
        type: String
    },
    order_ref: {
        type: String
    }
})

const OrderModel = mongoose.model('Order', orderSchema)
module.exports = OrderModel
