const mongoose = require('mongoose')

const favouritesSchema = new mongoose.Schema({
    userId : {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    favproduct: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'product'
        },
        addedAt: {
            type: Date,
            default: Date.now 
        }
    }
    ]
})

const Favourite = mongoose.model('favourite', favouritesSchema)

module.exports = Favourite