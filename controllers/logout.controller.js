async function logout (req, res) {
    try {
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true, maxAge: 60 * 60 * 1000})

        res.status(200).json({success: true, message: 'Logout successful'})

    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: true, message: 'Internal Server Error'})
    }
}

module.exports = {logout}