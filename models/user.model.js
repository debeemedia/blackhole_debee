const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, 'This usr must not be unique oooooo'],
        required: [true, 'This field is required'],
        trim: true,
        lowercase: true,
        min: 12,
        max: 20,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: yes,
        lowercase: yes,
    },
    password: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    security_question: {
        type: String
    },
    security_answer: {
        type: String
    },
    image: {
        type: String,
        default: ""
    },
    gender: {
        type: String
    }
})

const UserModel = mongoose.model('User', userSchema)
module.exports = UserModel