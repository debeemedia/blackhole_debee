require('dotenv').config()
const jwt = require('jsonwebtoken')

async function issueNewToken (req, res) {
    try {
        // check if there's a jwt refresh token in the cookie
        if (req.cookies.jwt) {
            const refreshToken = req.cookies.jwt
            // verify refresh token
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    return res.json({success: false, message: 'Unauthorized'})
                } else {
                    // issue a new access token
                    const accessToken = jwt.sign({id: decoded.id, email: decoded.email, username: decoded.username, role: decoded.role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'})
                    
                    return res.json({success: true, message: accessToken})
                }
            })
        } else {
            return res.json({success: false, message: 'Unauthorized'})
        }
    } catch (error) {
        console.log(error.message);
        res.json({success: true, message: 'Internal Server Error'})
    
    }
}

module.exports = {issueNewToken}