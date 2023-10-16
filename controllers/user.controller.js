const User = require("../models/user.model")
const { renderWelcomeMessage, sendMail } = require("../utils/mail")

async function createUser(req,res){
    const{username, email, password, first_name, last_name, security_question, security_answer, image, gender} = req.body
    if(!username || !email || !password || !first_name || !last_name) return res.status(400).json({success: false, message: 'required fields should not be empty'})
    try {
        const emailExist = await User.findOne({email: email})
        if (emailExist){
        res.status(400).json({success: false, message: 'email already exists'})
        }
        else{
            const newUser = await new User({username, email, password, first_name, last_name, security_question, security_answer, image, gender})
            await newUser.save()

            // send a mail to user on successful registration
            const emailOption = {
                to: email,
                from: 'Aphia',
                subject: 'Registration Successful',
                html: await renderWelcomeMessage(first_name, newUser)
            }
            await sendMail(emailOption, res)

            res.status(201).json({success: true, message: 'user created succesfully'})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: 'internal server error'})
    }
}
async function getUsers(req, res){
    try {
        const users = await User.find()
        res.status(200).json({success: true, message: data})
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    createUser,
    getUsers
}