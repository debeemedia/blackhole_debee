const express = require('express')
const { listenWebhook, retryPayment, getPayment } = require('../controllers/payment.controller')
const { ROUTE_PAYMENT_WEBHOOK, ROUTE_PAYMENT_RETRY, ROUTE_PAYMENT_GET } = require('../lib/page-route')
const router = express.Router()

router.post(ROUTE_PAYMENT_WEBHOOK, listenWebhook)
router.post(ROUTE_PAYMENT_RETRY, retryPayment)
router.get(ROUTE_PAYMENT_GET, getPayment)

module.exports.paymentRouter = router
