const Product = require("../models/product.model")

// CREATE
async function createProduct (req, res) {
    try {
        // destructure request body
        const {name, description, price, image, category, quantity} = req.body
        // validate input
        if (!name || !description || !price || !image || !category) {
            return res.status(400).json({success: false, message: 'Please provide all required fields'})
        }
        // check if product exists
        const existingProduct = await Product.findOne({name})
        if (existingProduct) {
            return res.status(400).json({success: false, message: 'Product with this name already exists'})
        }
        // create new product and save to database
        const newProduct = new Product({
            name, description, price, image, category, quantity
        })
        const savedProduct = await newProduct.save()

        res.status(201).json({success: true, message: 'Product created successfully', product: savedProduct})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
}

// READ OPERATIONS

// function to get all products
async function getProducts (req, res) {
    try {
        const products = await Product.find().select('-__v')
        res.status(200).json({success: true, products})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
}

// function to get a product by id
async function getProductById (req, res) {
    try {
        const {product_id} = req.params
        const product = await Product.findById(product_id, '-__v')
        // check if product exists
        if (!product) {
            return res.status(404).json({success: false, message: 'Product not found'})
        }
        res.status.json(200).json({success: true, product})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
}

// UPDATE
async function updateProduct (req, res) {
    try {
        const {product_id} = req.params
        const product = await Product.findById(product_id)
        // check if product exists
        if (!product) {
            return res.status(404).json({success: false, message: 'Product not found'})
        }
        const updatedProduct = await Product.findByIdAndUpdate(product_id, req.body, {new: true})
        res.status(200).json({success: false, product: updatedProduct})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
}

// DELETE
async function deleteProduct (req, res) {
    try {
        const {product_id} = req.params
        const product = await Product.findById(product_id)
        // check if product exists
        if (!product) {
            return res.status(404).json({success: false, message: 'Product not found'})
        }
        await Product.findByIdAndDelete(product_id)
        res.status(200).json({success: true, message: 'Product deleted successfully'})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
}

module.exports = {createProduct, getProducts, getProductById, updateProduct, deleteProduct}
