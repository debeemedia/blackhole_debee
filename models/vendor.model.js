const mongoose = require('mongoose')
const UserModel = require('./user.model')

const vendorSchema = new mongoose.Schema({
    business_name: {
        type: String,
        required: true
    },
    account_number: {
        type: String,
        required: true
    },
    bank: {
        type: String,
        required: true
    },
    bank_code: {
        type: String,
        required: true
    },
    account_name: {
        type: String,
        required: true
    },
    product_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
})

const VendorModel = UserModel.discriminator('Vendor', vendorSchema)
module.exports = VendorModel
