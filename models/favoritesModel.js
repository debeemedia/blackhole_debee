const mongoose = require('mongoose')

const favouritesSchema = new mongoose.Schema({
    userId : {
        Type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    favproduct: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'products'
        },
        addedAt: {
            type: Date,
            default: Date.now 
        }
    }
    ]
})

const Favourites = mongoose.model('favourites', favouritesSchema)

module.exports = Favourites