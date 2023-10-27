
const express = require('express')
const { ROUTE_CATEGORY_CREATE, ROUTE_CATEGORY_UPDATE, ROUTE_CATEGORY_DELETE, ROUTE_CATEGORY_GET_ALL, ROUTE_GET_PRODUCTS_BY_CATEGORY } = require('../lib/page-route')
const { authenticate } = require('../middleware/auth')
const { createCategory, updateCategory, deleteCategory, getAllCategories, getProductsByCategory } = require('../controllers/category.controller')
const router = express.Router()


router.get(ROUTE_CATEGORY_GET_ALL, getAllCategories)
router.get(ROUTE_GET_PRODUCTS_BY_CATEGORY, getProductsByCategory)
router.post(ROUTE_CATEGORY_CREATE, authenticate, createCategory)
router.put(ROUTE_CATEGORY_UPDATE, authenticate, updateCategory)
router.delete(ROUTE_CATEGORY_DELETE, authenticate, deleteCategory)


exports.categoryRouter = router