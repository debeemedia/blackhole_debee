const User = require("../models/user.model")

async function createUser(req,res){
    const{username, email, password, first_name, last_name, security_question, security_answer, image, gender} = req.body
    if(!username, email, password, first_name, last_name, security_question, security_answer, image, gender) return res.status(401).json({success: false, message: 'fields should not be empty'})
    try {
        const emailExist = await User.findOne({email: email})
        if (emailExist){
        res.status(401).json({success: false, message: 'email already exist'})
        }
        else{
            const newUser = new User({username, email, password, first_name, last_name, security_question, security_answer, image, gender})
            await newUser.save()
            res.status(200).json({success: true, message: 'user created succesfully'})
        }
    } catch (error) {
        console.error(error);
        res.status(401).json({success: false, message: 'unable to register user'})
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