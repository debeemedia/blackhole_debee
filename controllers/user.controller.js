const User = require("../models/user.model")

async function createUser(req,res){
    const{username, email, password, first_name, last_name, security_question, security_answer, image, gender} = req.body
}
async function getUsers(req, res){
    try {
        const users = await User.find({})
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    getUsers
}