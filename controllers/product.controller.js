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
            category_id,
            quantity
          } = req.body;
          
        // validate input
        const error = {};
        const validateRule = {
            name: "string|required",
            description: "string|required",
            price: "required",
            images: "array|min:1",
            category_id: "required",
            quantity: "min:1"
        };
        const validateMessage = {
            required: ":attribute is required",
            string: ":attribute must be a string"
            // number: ":attribute must be a number"
        };
        const validateResult = validateData(req.body, validateRule, validateMessage);
        if (!validateResult.success) {
            return res.json(validateResult.data);
        }

        // check if category exists
        const categoryExists = await CategoryModel.findById(category_id)
        if (empty(categoryExists)) {
            return res.json({ success: false, message: "Category not found" });
        }

        // check if vendor already has a product of the same name
        const existingProduct = await Product.findOne({ name : { $regex: name, $options: 'i' }}) // regex for case-insensitive search
        if (existingProduct && existingProduct.user_id == user_id) {
            return res.json({success: false, message: "You already have a product with same name"})
        }

        // access the uploaded file URLs from req.files (uploaded by multer)
        const image_default_url = 'https://pic.onlinewebfonts.com/thumbnails/icons_90947.svg'
        const image_urls = req.files ? req.files.map((file) => file.path) : [image_default_url]
        // check that user cannot upload more than 5 images
        if (image_urls.length > 5) {
            return res.json({ success: false, message: 'You can upload a maximum of 5 images' });
        }

        // create new product and save to database
        const newProduct = new Product({
            user_id,
            name,
            description,
            price,
            images: image_urls,
            category_id,
            quantity
        });

        await newProduct.save();

        res.json({success: true, message: 'Product created successfully', product: newProduct})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: 'Internal server error'})
    }
}

// READ OPERATIONS

// function to get all products
async function getProducts (req, res) {
    try {
        const products = await Product.find().select('-__v')
        if (empty(products)) {
            res.json({success: false, message: `No product found`})
        }
        res.json({success: true, message: products})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: 'Internal server error'})
    }
}

// function to get all products by a vendor
async function getProductsByVendor (req, res) {
    try {
        const userId = req.user.id
        const products = await Product.find({user_id: userId}).select('-__v')
        if (empty(products)) {
            return res.json({success: false, message: `You don't have a product yet`})
        }
        res.json({success: true, message: products})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: 'Internal server error'})
    }
}

// function to get a product by id
async function getProductById (req, res) {
    try {
        const {productId} = req.params
        const product = await Product.findById(productId, '-__v')
        // check if product exists
        if (!product) {
            return res.json({success: false, message: 'Product not found'})
        }
        res.json({success: true, message: product})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: 'Internal server error'})
    }
}

// UPDATE
async function updateProduct (req, res) {
    try {
        const {productId} = req.params
        const product = await Product.findById(productId)
        // check if product exists
        if (!product) {
            return res.json({success: false, message: 'Product not found'})
        }
        const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, {new: true})
        res.json({success: false, product: updatedProduct})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: 'Internal server error'})
    }
}

// add a product image
async function addProductImage (req, res) {
    try {
        const {productId} = req.params
        const product = await Product.findById(productId)
        // check if product exists
        if (!product) {
            return res.json({success: false, message: 'Product not found'})
        }

        // get the uploaded image url and update the database
        if (req.file) {
            const image_url = req.file.path
            const updatedProduct = await Product.findByIdAndUpdate(productId, {$push: {images: image_url}}, {new: true})

            if (!updatedProduct) {
                return res.json({ success: false, message: 'Failed to update product' });
            }

            return res.json({success: true, message: 'Image added successfully'})

        } else {
            return res.json({success: false, message: 'No image provided'})
        }
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: 'Internal server error'})
    }
}

// remove a product image
async function removeProductImage (req, res) {
    try {
        const {productId} = req.params
        const product = await Product.findById(productId)
        // check if product exists
        if (!product) {
            return res.json({success: false, message: 'Product not found'})
        }

        // get the index of the image to be deleted from the request body
        const deleteIndex = +req.body.deleteIndex

        // check if the deleteIndex is valid and then delete the image by the index from the database
        if (deleteIndex >= 0 && deleteIndex < product.images.length) {
            const updatedProduct = await Product.findByIdAndUpdate(productId, {$pull: {images:product.images[deleteIndex]}}, {new: true})

            if (!updatedProduct) {
                return res.json({ success: false, message: 'Failed to update product' });
            }
            
            return res.json({success: true, message: 'Image removed successfully'})
        } else {
            return res.json({success: false, message: 'Please provide a valid deleteIndex'})
        }

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: 'Internal server error'})
    }
}


// DELETE
async function deleteProduct (req, res) {
    try {
        const {productId} = req.params
        const product = await Product.findById(productId)
        // check if product exists
        if (!product) {
            return res.json({success: false, message: 'Product not found'})
        }
        await Product.findByIdAndDelete(productId)
        res.json({success: true, message: 'Product deleted successfully'})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: 'Internal server error'})
    }
}

// function to search for products and paginate search result
async function searchProducts(req, res) {
    try {
        // get the search query from the request body
        const query = req.body.query;
        // get the pagination parameters from the request body and set defaults
        const page = +req.body.page || 1
        const limit = +req.body.limit || 10

        // validate the query in the request body
        if (!query) {
            return res.json({ success: false, message: 'Please provide a search query' });
        }

        // calculate the number of items to skip based on the page and limit
        const skip = (page - 1) * limit;

        // find the products that match the search query (indexing has been set up in the product model and on atlas); and apply pagination
        const results = await Product.find({ $text: { $search: query } }).skip(skip).limit(limit);

        // check if query returns a search result
        if (!results || results.length === 0) {
            return res.json({ success: false, message: 'No result found' });
        }

        // calculate the total number of documents in the product collection and use it to calculate the total pages
        const totalCount = await Product.countDocuments({$text: {$search: query}});
        const totalPages = Math.ceil(totalCount / limit);

        // return the results array and the pagination details in the response body
        res.json({success: true, message: {results, pagination: {page, limit, totalPages, totalCount}}})

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: 'Internal server error' });
    }
}

module.exports = {createProduct, getProducts, getProductsByVendor, getProductById, updateProduct, addProductImage, removeProductImage, deleteProduct, searchProducts}
