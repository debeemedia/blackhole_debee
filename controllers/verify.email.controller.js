const User = require("../models/user.model");
const {empty} = require('../utils/helpers');
const { sendMail, buildEmailTemplate } = require("../utils/mail");

// function to verify the email
async function verifyEmail (req, res, next) {
    try {
        // get email from the query parameter in welcome.message.ejs
        const email = req.query.email
        if(empty(email)){
            return res.json({success: false, message: 'Something went wrong. Try again later'})
        }
        // find the user by the email
        const user = await User.findOne({email})
        if (!user) {
            return res.json({success: false, message: 'user does not exist'})
        }
        // change user's verified status to true
        user.verified = true
        // save the changes
        await user.save()

        // pass the user details on to sendConfirmationMail
        req.confirm_user = user
        next()

    } catch (error) {
        console.log(error.message)
        return res.json({success: false, message: 'internal server error'})
    }
}

async function sendConfirmationMail(req, res) {
    // get the user from verifyEmail middleware
    const user = req.confirm_user
    // send a confirmation mail to user on verification
    const emailOption = {
        to: user.email,
        from: "Aphia",
        subject: "Verification Successful",
        html: await buildEmailTemplate("confirmation.ejs", user),
      };
      await sendMail(emailOption, res);

    //   res.json({success: true, message: 'User verified successfully'})
    res.redirect(`https://aphia-stores.vercel.app/user/confirmation`)
}

module.exports = {verifyEmail, sendConfirmationMail}
