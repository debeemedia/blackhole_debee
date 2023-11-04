const express = require('express')
const { listenWebhook } = require('../controllers/payment.controller')
const { ROUTE_PAYMENT_WEBHOOK } = require('../lib/page-route')
const router = express.Router()

router.post(ROUTE_PAYMENT_WEBHOOK, listenWebhook)

module.exports.paymentRouter = router
