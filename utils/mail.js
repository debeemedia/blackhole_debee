require('promise-dotenv').config()
const nodemailer = require('nodemailer')
const ejs = require('ejs')

// use nodemailer to create transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'techdebee@gmail.com',
        pass: process.env.NODEMAILER_PASS
    }
})

// function to render the email welcome message
async function renderWelcomeMessage (first_name, user) {
    return await ejs.renderFile('views/welcome.message.ejs', {first_name, user})
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
            console.log({success: info})
        })
        return true
        
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {sendMail, renderWelcomeMessage}
