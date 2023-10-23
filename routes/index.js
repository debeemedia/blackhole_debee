
const express = require('express')
const router = express.Router()
const { getUsers, createUser } = require('../controllers/user.controller')
const { ROUTE_HOME, ROUTE_USER_REGISTER, ROUTE_VERIFY, ROUTE_TOKEN } = require('../lib/page-route')
const { verifyEmail } = require('../controllers/verify.email.controller')
const { issueNewToken } = require('../middleware/issue.token')

//user route
router.route(ROUTE_HOME).get(getUsers)
router.post(ROUTE_USER_REGISTER, createUser)


// route to issue new access token
router.post(ROUTE_TOKEN, issueNewToken)

// verification routes
// verify email
router.get(ROUTE_VERIFY, verifyEmail)


module.exports = router