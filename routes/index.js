
const express = require('express')
const router = express.Router()
const { getUsers, createUser } = require('../controllers/user.controller')
const { createVendor } = require('../controllers/vendor.controller')
const { ROUTE_HOME, ROUTE_USER_REGISTER, ROUTE_VERIFY, ROUTE_TOKEN, ROUTE_VENDOR_REGISTER } = require('../lib/page-route')
const { verifyEmail } = require('../controllers/verify.email.controller')
const { issueNewToken } = require('../middleware/issue.token')

//user route
router.route(ROUTE_HOME).get(getUsers)
router.post(ROUTE_USER_REGISTER, createUser)

// vendor
router.post(ROUTE_VENDOR_REGISTER, createVendor)


// route to issue new access token
router.post(ROUTE_TOKEN, issueNewToken)

// verification routes
// verify email
router.get(ROUTE_VERIFY, verifyEmail)


module.exports = router