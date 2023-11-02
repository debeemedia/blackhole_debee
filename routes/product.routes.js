// import express, controllers and middleware
const express = require('express')
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, addProductImage, removeProductImage } = require('../controllers/product.controller')
const { checkVendor } = require('../middleware/check.vendor')
const { checkVendorOwnership } = require('../middleware/check.vendor.ownership')
const { ROUTE_PRODUCT_CREATE, ROUTE_GET_PRODUCT, ROUTE_PRODUCT_GET_ALL, ROUTE_PRODUCT_UPDATE, ROUTE_PRODUCT_DELETE, ROUTE_PRODUCT_IMAGE_ADD, ROUTE_PRODUCT_IMAGE_REMOVE } = require('../lib/page-route')
const { authenticate } = require('../middleware/auth')
const { product_upload } = require('../utils/image.upload')

// create the router
const productRouter = express.Router()

// routes

// POST/CREATE
productRouter.post(ROUTE_PRODUCT_CREATE, authenticate, checkVendor, product_upload.array('product_image'), createProduct) // create a product

// GET/READ
productRouter.get(ROUTE_PRODUCT_GET_ALL, getProducts) // get all products
productRouter.get(ROUTE_GET_PRODUCT, getProductById) // get a product

// PUT/UPDATE
productRouter.put(ROUTE_PRODUCT_UPDATE, authenticate, checkVendor, checkVendorOwnership, updateProduct) // update a product
productRouter.put(ROUTE_PRODUCT_IMAGE_ADD, authenticate, checkVendor, checkVendorOwnership, product_upload.single('product_image'), addProductImage) // add a product image
productRouter.put(ROUTE_PRODUCT_IMAGE_REMOVE, authenticate, checkVendor, checkVendorOwnership, removeProductImage) // remove a product image

// DELETE
productRouter.delete(ROUTE_PRODUCT_DELETE, authenticate, checkVendor, checkVendorOwnership, deleteProduct) // delete a product

// export productRouter
module.exports = productRouter
