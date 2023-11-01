// import express, controllers and middleware
const express = require('express')
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/product.controller')
const { checkVendor } = require('../middleware/check.vendor')
const { checkVendorOwnership } = require('../middleware/check.vendor.ownership')
const { ROUTE_PRODUCT_CREATE, ROUTE_GET_PRODUCT, ROUTE_PRODUCT_GET_ALL, ROUTE_PRODUCT_UPDATE, ROUTE_PRODUCT_DELETE } = require('../lib/page-route')
const { authenticate } = require('../middleware/auth')
const upload = require('../utils/image.upload')

// create the router
const productRouter = express.Router()

// routes

// POST/CREATE
productRouter.post(ROUTE_PRODUCT_CREATE, authenticate, checkVendor, upload.array('product_image'), createProduct) // create a product

// GET/READ
productRouter.get(ROUTE_PRODUCT_GET_ALL, getProducts) // get all products
productRouter.get(ROUTE_GET_PRODUCT, getProductById) // get a product

// PUT/UPDATE
productRouter.put(ROUTE_PRODUCT_UPDATE, checkVendor, checkVendorOwnership, updateProduct) // update a product

// DELETE
productRouter.delete(ROUTE_PRODUCT_DELETE, checkVendor, checkVendorOwnership, deleteProduct) // delete a product

// export productRouter
module.exports = productRouter
