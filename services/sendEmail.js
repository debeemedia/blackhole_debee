const nodemailer = require('nodemailer')
require('promise-dotenv').config()

function sendEmail(emailData){
    const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth: {
            user:'techdebee@gmail.com',
            pass: process.env.NODEMAILER_PASS
        }
    })
    

transporter.sendMail(emailData,(err,data)=>{
    if(err){
        console.log(err.message)
    }
    console.log(data)
})
}

module.exports = sendEmail