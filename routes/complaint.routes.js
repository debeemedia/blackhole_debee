
const express = require('express')
const { ROUTE_COMPLIANT_MAKE, ROUTE_COMPLIANT_RESOLVE, ROUTE_COMPLIANT_REMOVE, ROUTE_COMPLIANT_GET_ALL } = require('../lib/page-route')
const { authenticate } = require('../middleware/auth')
const { makeComplaint, markResolved, deleteComplaint, getAllComplaint } = require('../controllers/complaint.controller')
const { checkAdmin } = require('../middleware/check.admin')
const router = express.Router()



router.post(ROUTE_COMPLIANT_MAKE, authenticate, makeComplaint)
router.put(ROUTE_COMPLIANT_RESOLVE, authenticate, checkAdmin, markResolved)
router.delete(ROUTE_COMPLIANT_REMOVE, authenticate, checkAdmin, deleteComplaint)
router.get(ROUTE_COMPLIANT_GET_ALL, authenticate, checkAdmin, getAllComplaint)

module.exports.complaintRouter = router