const User = require("../models/user.model");
const {empty} = require('../utils/helpers')

// function to verify the email
async function verifyEmail (req, res) {
    try {
        // get email from the query parameter in welcome.message.ejs
        const email = req.query.email
        if(empty(email)){
            return res.status(500).json({success: false, message: 'Something went wrong. Try again later'})
        }
        // find the user by the email
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json({success: false, message: 'user does not exist'})
        }
        // change user's verified status to true
        user.verified = true
        // save the changes
        await user.save()

        res.status(200).json({success: true, message: 'User verified successfully'})

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success: false, message: 'internal server error'})
    }
}

module.exports = {verifyEmail}
