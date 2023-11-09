
const express = require('express')
const { ROUTE_ORDER_CREATE, ROUTE_ORDER_DELIVERED, ROUTE_ORDER_ALL_BY_USER, ROUTE_ORDER_ONE_BY_USER, ROUTE_ORDER_ALL, ROUTE_ORDER_DELETE } = require('../lib/page-route')
const { createOrder, markDelivered, getAllOrdersByUser, getAnOrderByUser, getAllOrders, deleteOrder } = require('../controllers/order.controller')
const { initiatePayment } = require('../controllers/payment.controller')
const { authenticate } = require('../middleware/auth')
const router = express.Router()


router.post(ROUTE_ORDER_CREATE, authenticate, createOrder, initiatePayment)
router.put(ROUTE_ORDER_DELIVERED, markDelivered)
router.get(ROUTE_ORDER_ALL_BY_USER, authenticate, getAllOrdersByUser)
router.get(ROUTE_ORDER_ONE_BY_USER, authenticate, getAnOrderByUser)
router.get(ROUTE_ORDER_ALL, getAllOrders)
router.delete(ROUTE_ORDER_DELETE, authenticate, deleteOrder)


module.exports.orderRouter = router