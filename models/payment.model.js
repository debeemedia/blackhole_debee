const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    transaction_id: {
        type: String,
        required: true,
        unique: true
    },
    payment_gateway: {
        type: String,
        required: true,
        default: 'Flutterwave'
    },
    payment_method: {
        type: String,
        required: true,
        default: 'Bank transfer'
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
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        required: true,
        default: 'pending'
    }
}, {timestamps: true})

const PaymentModel = mongoose.model('Payment', paymentSchema)
module.exports = PaymentModel
