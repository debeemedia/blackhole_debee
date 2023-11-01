const mongoose = require('mongoose')

const favouritesSchema = new mongoose.Schema({
    user_id : {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    }
},{timestamps: true}
)

const Favourite = mongoose.model('favourite', favouritesSchema)

module.exports = Favourite