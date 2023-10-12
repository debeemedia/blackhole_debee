async function checkAdmin (req, res, next) {
    try {
        // check if user is an admin
        if (req.user && req.user.role === 'admin') {
            next()
        } else {
            res.status(403).json({success: false, message: 'Access Denied. Admin Only'})
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: false, message: 'Internal Server Error'})
    }
}

module.exports = {checkAdmin}
