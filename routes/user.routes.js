
const express = require('express')
const router = express.Router()
const { getUsers, createUser, updateUser, deleteUser, resendMail } = require('../controllers/user.controller')
const { createVendor } = require('../controllers/vendor.controller')
const { ROUTE_HOME, ROUTE_USER_REGISTER, ROUTE_VERIFY, ROUTE_TOKEN, ROUTE_VENDOR_REGISTER, ROUTE_USER_LOGIN, ROUTE_USER_LOGOUT, ROUTE_USER_UPDATE, ROUTE_USERS_GET, ROUTE_USER_DELETE, ROUTE_RESEND, ROUTE_FORGOT_PASSWORD, ROUTE_RESET_PASSWORD } = require('../lib/page-route')
const { verifyEmail, sendConfirmationMail } = require('../controllers/verify.email.controller')
const { issueNewToken } = require('../middleware/issue.token')
const { login } = require('../controllers/login.controller')
const { logout } = require('../controllers/logout.controller')
const { authenticate } = require('../middleware/auth')
const { generateToken, resetPassword } = require('../controllers/password.recovery')
const { profile_upload } = require('../utils/image.upload')

//register as a user 
// router.route(ROUTE_HOME).get(getUsers)
router.post(ROUTE_USER_REGISTER, profile_upload.single('profile_image'), createUser)

//resend verification mail
router.post(ROUTE_RESEND, resendMail)

//register as a vendor
router.post(ROUTE_VENDOR_REGISTER, profile_upload.single('profile_image'), createVendor)

// verify email
router.get(ROUTE_VERIFY, verifyEmail, sendConfirmationMail)

//login
router.post(ROUTE_USER_LOGIN, login)

// route to issue new access token
router.post(ROUTE_TOKEN, issueNewToken)

// get all users
router.get(ROUTE_USERS_GET, getUsers)

//logout
router.get(ROUTE_USER_LOGOUT, logout)

// update user details
router.put(ROUTE_USER_UPDATE, authenticate, profile_upload.single('profile_image'), updateUser)

router.delete(ROUTE_USER_DELETE, authenticate, deleteUser)

// forgot password
router.post(ROUTE_FORGOT_PASSWORD, generateToken)

// reset password
router.post(ROUTE_RESET_PASSWORD, resetPassword)



module.exports.userRouter = router