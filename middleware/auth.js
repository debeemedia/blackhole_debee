require('dotenv').config()
const jwt = require('jsonwebtoken')

async function authenticate (req, res, next) {
    try {
        const token = req.headers.authorization
        // check if token is provided
        if (!token) {
            return res.status(401).json({success: false, message: 'Unauthorized'})
        }
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            req.user = decoded
            next()

        } catch (error) {
            console.log(error.message);
            return res.status(401).json({success: false, message: error.message})
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: false, message: 'Internal Server Error'})
    }
}

module.exports = {authenticate}