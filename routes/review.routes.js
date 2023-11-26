
const express = require('express')
const { ROUTE_REVIEW_CREATE, ROUTE_REVIEW_UPDATE, ROUTE_REVIEW_DELETE, ROUTE_REVIEW_GET_PRODUCT_REVIEWS, ROUTE_REVIEW_VENDOR } = require('../lib/page-route')
const { authenticate } = require('../middleware/auth')
const { addReview, updateReview, deleteReview, getProductReviews, getVendorReviews } = require('../controllers/review.controller')
const { checkVendor } = require('../middleware/check.vendor')
const router = express.Router()


router.post(ROUTE_REVIEW_CREATE, authenticate, addReview)
router.put(ROUTE_REVIEW_UPDATE, authenticate, updateReview)
router.delete(ROUTE_REVIEW_DELETE, authenticate, deleteReview)
router.get(ROUTE_REVIEW_GET_PRODUCT_REVIEWS, getProductReviews)
router.get(ROUTE_REVIEW_VENDOR, authenticate, checkVendor, getVendorReviews)


exports.reviewRouter = router