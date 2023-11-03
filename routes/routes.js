
const express = require('express')
const { categoryRouter } = require('./category.routes')
const productRouter = require('./product.routes')
const { reviewRouter } = require('./review.routes')
const { faqRouter } = require('./faq.routes')
const { orderRouter } = require('./order.routes')
const { userRouter } = require('./user.routes')
const { favoritesRouter } = require('./favorites.routes')
const { paymentRouter } = require('./payment.routes')
const { flashRouter } = require('./flash.routes')
const router = express.Router()


router.use('/users', userRouter)
router.use('/categories', categoryRouter)
router.use('/products', productRouter)
router.use('/reviews', reviewRouter )
router.use('/faqs', faqRouter)
router.use('/orders', orderRouter)
router.use('/favorites', favoritesRouter)
router.use(paymentRouter)
router.use(flashRouter)


module.exports = router