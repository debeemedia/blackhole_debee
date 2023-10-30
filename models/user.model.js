const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const OrderModel = require("./order.model");
const { ReviewModel } = require("./review.model");
const PaymentModel = require("./payment.model");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "username already exists"],
        required: [true, "username is required"],
        trim: true,
        lowercase: true,
        maxlength: [24, "username should not be more than 24 characters"],
    },
    email: {
        type: String,
        unique: [true, "email already exists"],
        required: [true, "email is required"],
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    first_name: {
        type: String,
        required: [true, "first name is required"],
        trim: true,
    },
    last_name: {
        type: String,
        required: [true, "last name is required"],
        trim: true,
    },
    phone_number: {
        type: String,
        required: [true, "phone number is required"],
    },
    security_question: {
        type: String,
    },
    security_answer: {
        type: String,
    },
    image: {
        type: String,
        default:
            "https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg",
    },
    gender: {
        type: String,
        enum: ["male", "female", "prefer not to say"],
    },
    role: {
        type: String,
        enum: ["user", "vendor", "admin"],
        default: "user",
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
});
userSchema.pre("save", async function (next) {
    try {
        if (this.isModified("password")) {
            // const saltRounds = bcrypt.genSalt(10)
            // const hashPassword = await bcrypt.hash(this.password, saltRounds)
            const hashPassword = await bcrypt.hash(this.password, 10);
            this.password = hashPassword;
        }
        next();
    } catch (error) {
        return next(error);
    }
});

userSchema.pre("findByIdAndDelete", async function (next) {
    try {
        const user = this;
        await OrderModel.deleteMany({ user_id: user._id });
        await ReviewModel.deleteMany({user_id: user._id})
        await PaymentModel.deleteMany({user_id: user._id})
        next();
    } catch (error) {
        return next(error);
    }
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
