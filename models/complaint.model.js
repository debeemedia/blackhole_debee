
const mongoose = require('mongoose')

const complaintSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    order_ref: {
        type: String,
        required: true
    },
    ticket_id : {
        type: String,
        required: true
    },
    resolved: {
        type: Boolean,
        default: false
    }
},{timestamps: true})


module.exports.ComplaintModel = mongoose.model('Complaint', complaintSchema)