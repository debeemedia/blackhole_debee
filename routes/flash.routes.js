
const express = require('express')
const { ROUTE_FLASH_ADD, ROUTE_FLASH_GET, ROUTE_FLASH_REMOVE } = require('../lib/page-route')
const { authenticate } = require('../middleware/auth')
const { checkVendor } = require('../middleware/check.vendor')
const { checkVendorOwnership } = require('../middleware/check.vendor.ownership')
const { addToFlash, removeFromFlash, getFlashSales } = require('../controllers/flash.controller')
const router = express.Router()


router.post(ROUTE_FLASH_ADD, authenticate, checkVendor, addToFlash)
router.delete(ROUTE_FLASH_REMOVE, authenticate, checkVendor, checkVendorOwnership, removeFromFlash)
router.get(ROUTE_FLASH_GET, getFlashSales)

module.exports.flashRouter = router