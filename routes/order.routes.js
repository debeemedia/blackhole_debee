
const express = require('express')
const { ROUTE_ORDER_CREATE, ROUTE_ORDER_DELIVERED, ROUTE_ORDER_ALL_BY_USER, ROUTE_ORDER_ONE_BY_USER, ROUTE_ORDER_ALL } = require('../lib/page-route')
const { createOrder, markDelivered, getAllOrdersByUser, getAnOrderByUser, getAllOrders } = require('../controllers/order.controller')
const { initiatePayment } = require('../controllers/payment.controller')
const router = express.Router()


router.post(ROUTE_ORDER_CREATE, createOrder, initiatePayment)
router.put(ROUTE_ORDER_DELIVERED, markDelivered)
router.get(ROUTE_ORDER_ALL_BY_USER, getAllOrdersByUser)
router.get(ROUTE_ORDER_ONE_BY_USER, getAnOrderByUser)
router.get(ROUTE_ORDER_ALL, getAllOrders)


module.exports.orderRouter = router