const ProductModel = require("../models/product.model");

async function checkVendorOwnership (req, res) {
    try {
        // destructure product id from req.params
        const {product_id} = req.params
        // find the product by id
        const product = ProductModel.findById(product_id)
        // check if the product exists
        if (!product) {
            return res.json({success: false, message: 'Product not found'})
        }
        // check if the user is the owner of the product
        if (product.user_id == req.user.id) {
            next()
        } else {
            res.json({success: false, message: 'Access Denied. You are not the vendor of this product'})
        }

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: 'Internal Server Error'})
    }
}

module.exports = {checkVendorOwnership}