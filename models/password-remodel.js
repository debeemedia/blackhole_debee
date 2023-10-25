const mongoose = require('mongoose')

const recoverSchema = ({
    token: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    iat:{
        type: Date,
        default: Date.now()
    },
    expTime: {
        type: Date,
        required: true,
        default: Date.now()+300000
    }
})

const RecoverModel = mongoose.model('recover', recoverSchema )
module.exports = RecoverModel
