const CategoryModel = require("../models/category.model")
const Product = require("../models/product.model")
const { empty } = require("../utils/helpers");
const validateData = require("../utils/validate");


// CREATE
async function createProduct (req, res) {
    try {
        // get the id of the logged-in vendor
        const user_id = req.user.id

        // destructure request body
        const {
            name,
            description,
            price,
            image,
            category_name,
            quantity
          } = req.body;
          
        // validate input
        const error = {};
        const validateRule = {
            name: "string|required",
            description: "string|required",
            price: "required",
            image: "string|min:1",
            category_name: "string|required",
            quantity: "min:1"
        };
        const validateMessage = {
            required: ":attribute is required",
            string: ":attribute must be a string"
            // number: ":attribute must be a number"
        };
        const validateResult = validateData(req.body, validateRule, validateMessage);
        if (!validateResult.success) {
            return res.status(400).json(validateResult.data);
        }

        // check if category exists
        // const categoryExists = await CategoryModel.findOne({category_name})
        // if (empty(categoryExists)) {
        //     return res.status(404).json({ success: false, message: "Category not found" });
        // }

        // // check if vendor already of same name
        // const existingProduct = await Product.findOne({name})
        // if (existingProduct.user_id == user_id) {
        //     return res.status(400).json({success: false, message: "You already have a product with same name"})
        // }


        // create new product and save to database
        const newProduct = new Product({
            user_id,
            name,
            description,
            price,
            image,
            category_name,
            //   category_id,
            quantity
        });

        await newProduct.save();

        res.status(201).json({success: true, message: 'Product created successfully', product: newProduct})

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
        const {productId} = req.params
        const product = await Product.findById(productId, '-__v')
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
        const {productId} = req.params
        const product = await Product.findById(productId)
        // check if product exists
        if (!product) {
            return res.status(404).json({success: false, message: 'Product not found'})
        }
        const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, {new: true})
        res.status(200).json({success: false, product: updatedProduct})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
}

// DELETE
async function deleteProduct (req, res) {
    try {
        const {productId} = req.params
        const product = await Product.findById(productId)
        // check if product exists
        if (!product) {
            return res.status(404).json({success: false, message: 'Product not found'})
        }
        await Product.findByIdAndDelete(productId)
        res.status(200).json({success: true, message: 'Product deleted successfully'})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
}

module.exports = {createProduct, getProducts, getProductById, updateProduct, deleteProduct}
