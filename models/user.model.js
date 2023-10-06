const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, 'username already exists'],
        required: [true, 'This field is required'],
        trim: true,
        lowercase: true,
        min: [12, 'username should not be less than 12 characters'],
        max: 20,
    },
    email: {
        type: String,
        unique: [true, "email already exists"],
        required: [true, 'This field is required'], 
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "field should not be empty" ],
    },
    first_name: {
        type: String,
        required: [true, "field should not be empty" ],
        trim: true
    },
    last_name: {
        type: String,
        required: [true, "field should not be empty" ],
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
        default: "https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg"
    },
    gender: {
        type: String
    }
})

const UserModel = mongoose.model('User', userSchema)
module.exports = UserModel