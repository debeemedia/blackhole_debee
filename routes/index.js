
const express = require('express')
const router = express.Router()
const { getUsers, createUser } = require('../controllers/user.controller')
const { ROUTE_HOME } = require('../lib/page-route')
const { verifyEmail } = require('../controllers/verify.email.controller')
const { issueNewToken } = require('../middleware/issue.token')

//user route
router.route(ROUTE_HOME).get(getUsers)

// testing register route
router.post('/register', createUser)

// route to issue new access token
router.post('/token', issueNewToken)

// verification routes
// verify email
router.get('/verify', verifyEmail)

module.exports = router