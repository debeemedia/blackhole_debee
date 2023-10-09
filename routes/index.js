
const express = require('express')
const router = express.Router()
const { getUsers } = require('../controllers/user.controller')
const { ROUTE_HOME } = require('../lib/page-route')

//user route
router.route(ROUTE_HOME).get(getUsers)


module.exports = router