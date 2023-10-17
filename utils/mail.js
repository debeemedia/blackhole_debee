require('promise-dotenv').config()
const nodemailer = require('nodemailer')
const ejs = require('ejs')

// use nodemailer to create transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.NODEMAILER_PASS
    }
})

// function to render the email welcome message
async function buildEmailTemplate (fileName, data) {
    return await ejs.renderFile(`views/${fileName}`, data)
}

// function to send mail
async function sendMail (option) {
    try {
        // check if there is an email option specified (from the register/createUser controller)
        if (!option.to || !option.from || !option.subject || !option.html) {
            console.log({success: false, message: 'Please provide email options [to from subject html]'})
            return false
        }
        transporter.sendMail(option, (err, info) => {
            if (err) {
                return console.log('Error sending mail:', err.message)
            }
            console.log('Mail sent!', info.response)
        })
        return true
        
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {sendMail, buildEmailTemplate}
