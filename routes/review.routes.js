
const express = require('express')
const { ROUTE_REVIEW_CREATE, ROUTE_REVIEW_UPDATE, ROUTE_REVIEW_DELETE, ROUTE_REVIEW_GET_PRODUCT_REVIEWS } = require('../lib/page-route')
const { authenticate } = require('../middleware/auth')
const { addReview, updateReview, deleteReview } = require('../controllers/review.controller')
const router = express.Router()


router.post(ROUTE_REVIEW_CREATE, authenticate, addReview)
router.put(ROUTE_REVIEW_UPDATE, authenticate, updateReview)
router.delete(ROUTE_REVIEW_DELETE, authenticate, deleteReview)
router.get(ROUTE_REVIEW_GET_PRODUCT_REVIEWS, getProductReviews)


exports.reviewRouter = router