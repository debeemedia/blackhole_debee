// import express, controllers and middleware
const express = require('express')
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/product.controller')
const { checkAdmin } = require('../middleware/check.admin')

// create the router
const productRouter = express.Router()

// routes

// POST/CREATE
productRouter.post('/create', checkAdmin, createProduct) // create a product

// GET/READ
productRouter.get('', getProducts) // get all products
productRouter.get('/:product_id', getProductById) // get a product

// PUT/UPDATE
productRouter.put('/:product_id', checkAdmin, updateProduct) // update a product

// DELETE
productRouter.delete('/:product_id/delete', checkAdmin, deleteProduct) // delete a product

// export productRouter
module.exports = productRouter
