const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, 'username already exists'],
        required: [true, 'username is required'],
        trim: true,
        lowercase: true,
        minlength: [12, 'username should not be less than 12 characters'],
        maxlength: 20,
    },
    email: {
        type: String,
        unique: [true, "email already exists"],
        required: [true, 'email is required'], 
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "password is required" ],
    },
    first_name: {
        type: String,
        required: [true, "first name is required"],
        trim: true
    },
    last_name: {
        type: String,
        required: [true, "last name is required" ],
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
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
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
})
userSchema.pre('save', async function(next){
    try{
        if(this.isModified('password')){
        const saltRounds = bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(this.password, saltRounds)
        this.password = hashPassword
    }
    next()
}
    catch(error){
        return next(error)
    }
 })



const UserModel = mongoose.model('User', userSchema)
module.exports = UserModel