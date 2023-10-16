
const CategoryModel = require('../models/category.model')
const Products = require('../models/product_model')

// Create new category
async function createCategory(req,res){
    try {
        const {_id} = req.user
        const {name , description} = req.body

        if (!name) return res.status(400).json({success: false, message: `Please provide required field`}) 

        const newCategory = new CategoryModel({name , description, user_id: _id})
        await newCategory.save()

        res.status(201).json({success: true, message: 'Category created successfully'})
    } catch (error) {
        res.status(500).json({success: false, error: error.message})
    }
}

// Delete a category
async function deleteCategory(req,res){
    try {
        const {_id} = req.user
        const categoryId = req.params.id
        
        if (!categoryId) {
            return res.status(400).json({success: false, message: 'Please provide category ID'})
        }
        
        const category = await CategoryModel.findById(categoryId)
        if (!category) {
            return res.status(404).json({success: false, message: 'Category not found'})
        }

        if (category.user_id !== _id) {
            return res.status(401).json({success: false, message: 'You are not authorized to perform this action'})
        }

        const products = Products.find({category: categoryId})
        if (products.length == 0) {
            return res.status(404).json({success: false, message: 'No product found in this category'})
        }

        const deletedCategory = CategoryModel.findByIdAndDelete(categoryId)
        
        res.status(200).json({success: true, message: 'Category deleted successfully'})
      
    } catch (error) {
        res.status(500).json({success: false, error: error.message})
    }
}

//Get all products in a category
async function getProductsByCategory(req,res){
    try {
        const categoryId = req.params.id
        
        if (!categoryId) {
            return res.status(400).json({success: false, message: 'Please provide category ID'})
        }
        
        const category = await CategoryModel.findById(categoryId)
        if (!category) {
            return res.status(404).json({success: false, message: 'Category not found'})
        }

        const products = Products.find({category: categoryId}).select('-__v')
        if (products.length == 0) {
            return res.status(404).json({success: false, message: 'No product found in this category'})
        }
        
        res.status(200).json({success: true, message: products})
      
    } catch (error) {
        res.status(500).json({success: false, error: error.message})
    }
}

//Update a category
async function updateCategory(req,res){
    try {
        const {_id} = req.user
        const categoryId = req.params.id
        const {name, description} = req.user

        if (!name && !description) {
            return res.status(400).json({success: false, message: 'Please provide at least one field'})
        }

        const updateDetails = {}

        if (name) {
            updateDetails.name = name
        }

        if (description) {
            updateDetails.description = description

        }
        
        if (!categoryId) {
            return res.status(400).json({success: false, message: 'Please provide category ID'})
        }
        
        const category = await CategoryModel.findById(categoryId)
        if (!category) {
            return res.status(404).json({success: false, message: 'Category not found'})
        }

        if (category.user_id !== _id) {
            return res.status(401).json({success: false, message: 'You are not authorized to perform this action'})
        }

        const products = Products.find()
        if (products.length == 0) {
            return res.status(404).json({success: false, message: 'No product found in this category'})
        }

        const updatedCategory = CategoryModel.findByIdAndUpdate(categoryId , updateDetails , {new: true})
        
        res.status(200).json({success: true, message: 'Category updated successfully'})
      
    } catch (error) {
        res.status(500).json({success: false, error: error.message})
    }
}


module.exports = {
    createCategory,
    deleteCategory,
    updateCategory,
    getProductsByCategory
}