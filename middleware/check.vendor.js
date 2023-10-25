async function checkVendor (req, res, next) {
    try {
        // check if user is a vendor
        if (req.user && req.user.role === 'vendor') {
            next()
        } else {
            res.status(403).json({success: false, message: 'Access Denied. Vendor Only'})
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: false, message: 'Internal Server Error'})
    }
}

module.exports = {checkVendor}
