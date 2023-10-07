const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    address: {
        type: String,
        required: true
    },
    cart_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true
    },
    order_date: {
        type: Date
    },
    delivery_date: {
        type: Date
    },
    is_fulfilled: {
        default: false
    }
})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order