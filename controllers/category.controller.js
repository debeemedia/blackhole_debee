
const CategoryModel = require('../models/category.model')
const Products = require('../models/product.model')

// Create new category
async function createCategory(req,res){
    try {
        const {id} = req.user
        const {name , description} = req.body

        if (!name) return res.json({success: false, message: `Please provide required field`}) 

        const newCategory = new CategoryModel({name, description, user_id: id})
        await newCategory.save()

        res.json({success: true, message: 'Category created successfully'})
    } catch (error) {
        res.json({success: false, error: error.message})
    }
}

// Delete a category
async function deleteCategory(req,res){
    try {
        const {id} = req.user
        const {categoryId} = req.params
        
        if (!categoryId) {
            return res.json({success: false, message: 'Please provide category ID'})
        }
        
        const category = await CategoryModel.findById(categoryId)
        if (!category) {
            return res.json({success: false, message: 'Category not found'})
        }

        if (category.user_id != id) {
            return res.json({success: false, message: 'You are not authorized to perform this action'})
        }

        await Products.deleteMany({category_id: category._id})

        const deletedCategory = await CategoryModel.findOneAndDelete({_id: categoryId})
        
        res.json({success: true, message: 'Category deleted successfully'})
      
    } catch (error) {
        res.json({success: false, error: error.message})
    }
}

//Get all products in a category
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

//Update a category
async function updateCategory(req,res){
    try {
        const {id} = req.user
        const {categoryId} = req.params
        const {name, description} = req.body

        if (!name && !description) {
            return res.json({success: false, message: 'Please provide at least one field'})
        }

        const updateDetails = {}

        if (name) {
            updateDetails.name = name
        }

        if (description) {
            updateDetails.description = description

        }
        
        if (!categoryId) {
            return res.json({success: false, message: 'Please provide category ID'})
        }
        
        const category = await CategoryModel.findById(categoryId)
        if (!category) {
            return res.json({success: false, message: 'Category not found'})
        }

        if (category.user_id != id) {
            return res.json({success: false, message: 'You are not authorized to perform this action'})
        }

        const updatedCategory = await CategoryModel.findByIdAndUpdate(categoryId , updateDetails , {new: true})
        
        res.json({success: true, message: 'Category updated successfully'})
      
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
    createCategory,
    deleteCategory,
    updateCategory,
    getProductsByCategory,
    getAllCategories
}