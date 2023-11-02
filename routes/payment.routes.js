const express = require('express')
const { listenWebhook } = require('../controllers/payment.controller')
const router = express.Router()

router.post('/webhook/flutterwave', listenWebhook)

module.exports.paymentRouter = router
