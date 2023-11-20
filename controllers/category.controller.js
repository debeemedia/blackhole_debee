const CategoryModel = require('../models/category.model')
const Products = require('../models/product.model')

// Get all products in a category
async function getProductsByCategory(req,res){
    try {
        const {categoryName} = req.params
        
        if (!categoryName) {
            return res.json({success: false, message: 'Please provide category name'})
        }
        
        const category = await CategoryModel.findOne({name: categoryName})
        if (!category) {
            return res.json({success: false, message: 'Category not found'})
        }

        const products = await Products.find({category_id: category._id}).select('-__v')
        if (products.length == 0) {
            return res.json({success: false, message: 'No product found in this category'})
        }
        
        res.json({success: true, message: products})
      
    } catch (error) {
        res.json({success: false, error: error.message})
    }
}

async function getAllCategories(req,res) {
    try {
        const categories = await CategoryModel.find().select('-__v')

        if (categories.length == 0) {
            return res.json({success: false, message: `No category found`})
        }

        res.json({success: true, message: categories})
    } catch (error) {
        res.json({success: false, error: error.message})   
    }
}


module.exports = {
    getProductsByCategory,
    getAllCategories
}