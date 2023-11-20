
const express = require('express')
const { ROUTE_CATEGORY_GET_ALL, ROUTE_GET_PRODUCTS_BY_CATEGORY } = require('../lib/page-route')
const { getAllCategories, getProductsByCategory } = require('../controllers/category.controller')
const { checkAdmin } = require('../middleware/check.admin')
const router = express.Router()


router.get(ROUTE_CATEGORY_GET_ALL, getAllCategories)
router.get(ROUTE_GET_PRODUCTS_BY_CATEGORY, getProductsByCategory)

exports.categoryRouter = router