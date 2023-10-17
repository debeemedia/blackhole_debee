const UserModel = require("../models/user.model")
const User = require("../models/user.model")
const { sendMail, buildEmailTemplate } = require("../utils/mail")

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
                html: await buildEmailTemplate(newUser)
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

async function updateUsers(req,res){
const{username,email, password, first_name, last_name, image, gender  } = req.body
const userId = req.user.id
const user = await UserModel.findById(userId)
if(username) user.username = username 
if(email) user.email = email 
if(password) user.password = password
if(first_name) user.first_name = first_name
if(last_name) user.last_name = last_name 
if(image) user.image = image 
if(gender) user.gender = gender
await user.save()
res.status(200).json({success: true, message: 'user updated succesfully'})

}

module.exports = {
    createUser,
    getUsers,
    updateUsers
}