require('dotenv').config()
const User = require("../models/user.model");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const VendorModel = require('../models/vendor.model');

async function login (req, res) {
    try {
        const {email, username, password} = req.body
        // allow user to login with either email or username and password
        if(!password && (!email || !username)) {
            return res.json({success: false, message: 'Please provide your login details'})
        }
        const user = await User.findOne({$or: [{email}, {username}]}, '-__v')
        // check if user exists
        if (!user) {
            return res.json({success: false, message: 'User is not registered'})
        }
        // verify password
        bcrypt.compare(password, user.password, (err, result) => {
            if (result === true) {
                // check if user is verified
                if (!user.verified) {
                    return res.json({success: false, message: 'user is not verified'})
                }

                // issue jwt token
                // define payload
                const payload = {
                    id: user._id,
                    email: user.email,
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role: user.role,
                  };
                // add business_name to payload if user is a vendor
                if (user.role === 'vendor' && user.business_name) {
                    payload.business_name = user.business_name;
                }

                const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '2h' });
                // console.log('JWT Payload:', jwt.decode(token));

                res.json({success: true, message: token, role: user.role})

            } else {
                return res.json({success: false, message: 'Incorrect Credentials'})
            }
        })
    } catch (error) {
        console.log(error.message);
        res.json({success: true, message: 'Internal server error'})
    }
}

module.exports = {login}
