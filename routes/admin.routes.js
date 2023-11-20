const express = require('express')
const { ROUTE_ADMIN_DELETE_USER, ROUTE_ADMIN_VERIFY_USER, ROUTE_ADMIN_DELETE_PRODUCT, ROUTE_ADMIN_CATEGORY_CREATE, ROUTE_ADMIN_CATEGORY_UPDATE, ROUTE_ADMIN_CATEGORY_DELETE, ROUTE_ADMIN_CHANGE_USER } = require('../lib/page-route')
const { authenticate } = require('../middleware/auth')
const { checkAdmin } = require('../middleware/check.admin')
const { deleteUserById, verifyUser, deleteProductById, createCategory, updateCategory, deleteCategory, userToAdmin } = require('../controllers/admin.controller')
const router = express.Router()

// ADMIN-RELATED ADMIN ROUTES
router.put(ROUTE_ADMIN_CHANGE_USER, authenticate, checkAdmin, userToAdmin)


// USER-RELATED ADMIN ROUTES

// delete user by admin
router.delete(ROUTE_ADMIN_DELETE_USER, authenticate, checkAdmin, deleteUserById)
// verify user by admin
router.put(ROUTE_ADMIN_VERIFY_USER, authenticate, checkAdmin, verifyUser)


// PRODUCT-RELATED ADMIN ROUTES

// delete product by admin
router.delete(ROUTE_ADMIN_DELETE_PRODUCT, authenticate, checkAdmin, deleteProductById)


// CATEGORY-RELATED ADMIN ROUTES

// create category
router.post(ROUTE_ADMIN_CATEGORY_CREATE, authenticate, checkAdmin, createCategory)
// update category
router.put(ROUTE_ADMIN_CATEGORY_UPDATE, authenticate, checkAdmin, updateCategory)
// delete category
router.delete(ROUTE_ADMIN_CATEGORY_DELETE, authenticate, checkAdmin, deleteCategory)

module.exports.adminRouter = router
