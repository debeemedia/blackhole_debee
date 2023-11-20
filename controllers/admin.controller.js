const CategoryModel = require("../models/category.model");
const Favourite = require("../models/favourite.model");
const { FlashModel } = require("../models/flashSale.model");
const OrderModel = require("../models/order.model");
const PaymentModel = require("../models/payment.model");
const ProductModel = require("../models/product.model");
const { ReviewModel } = require("../models/review.model");
const UserModel = require("../models/user.model");
const { empty } = require("../utils/helpers");

// ADMIN-RELATED ADMIN PERMISSIONS

// function to change a user's role to admin (only admin can do this)
async function userToAdmin (req, res) {
    try {
        // get the id of the user whose role is to be changed to admin from the req.params
        const {userId} = req.params;
        // validate user id
        if(empty(userId)){
            return res.json({success: false, message: 'Please provide a valid userId'})
        }
        // check if user exists
        const user = await UserModel.findById(userId)
        if(empty(user)){
            return res.json({success: false, message: 'User not found'})
        }
        // check if the user is already an admin
        if (user.role === 'admin') {
            return res.json({ success: false, message: 'User is already an admin' });
        }
        // change user's role to admin
        await UserModel.findByIdAndUpdate(userId, {role: 'admin'})

        res.json({ success: true, message: "User updated to admin successfully" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Internal server error" });
    }
}

// USER-RELATED ADMIN PERMISSIONS

// external deletion of a user's account by admin (middleware to check for admin implemented)
async function deleteUserById(req, res) {
    try {
        // get the id of the user to be deleted from the req.params
        const {userId} = req.params;
        // validate user id
        if(empty(userId)){
            return res.json({success: false, message: 'Please provide a valid userId'})
        }
        // check if user exists
        const user = await UserModel.findById(userId)
        if(empty(user)){
            return res.json({success: false, message: 'User not found'})
        }
        // check if user is an admin
        if (user.role === 'admin') {
            return res.json({success: false, message: 'You cannot delete an admin'})
        }
        // delete resources dependent on user
        await ProductModel.deleteMany({user_id: userId})
        await OrderModel.deleteMany({ user_id: userId });
        await ReviewModel.deleteMany({user_id: userId})
        await PaymentModel.deleteMany({user_id: userId})
        await Favourite.deleteMany({user_id: userId})
        await FlashModel.deleteMany({user_id: userId})
        
        // delete user
        await UserModel.findOneAndDelete({_id: userId})

        res.json({ success: true, message: "User deleted successfully" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Internal server error" });
    }
}

// external verification of a user by admin
async function verifyUser (req, res) {
    try {
        // get the id of the user to be verified from the req.params
        const {userId} = req.params;
        // validate user id
        if(empty(userId)){
            return res.json({success: false, message: 'Please provide a valid userId'})
        }
        // check if user exists
        const user = await UserModel.findById(userId)
        if(empty(user)){
            return res.json({success: false, message: 'User not found'})
        }
        // check if the user is already verified
        if (user.verified === true) {
            return res.json({ success: false, message: 'User is already verified' });
        }
        // verify user
        await UserModel.findByIdAndUpdate(userId, {verified: true})

        res.json({ success: true, message: "User verified successfully" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Internal server error" });
    }
}

// PRODUCT-RELATED ADMIN PERMISSIONS

// external deletion of a product by admin
async function deleteProductById (req, res) {
    try {
        const {productId} = req.params
        // validate product id
        if(empty(productId)){
            return res.json({success: false, message: 'Please provide a valid productId'})
        }
        // check if product exists
        const product = await ProductModel.findById(productId)
        if (!product) {
            return res.json({success: false, message: 'Product not found'})
        }

        // delete resources dependent on product
        await Favourite.deleteMany({product: product._id})
        await ReviewModel.deleteMany({product_id: product._id})
        await FlashModel.deleteOne({product: product._id})

        // delete product
        await ProductModel.findOneAndDelete({_id: productId})

        res.json({success: true, message: 'Product deleted successfully'})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: 'Internal server error'})
    }
}

// CATEGORY-RELATED ADMIN PERMISSIONS

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

// Update a category
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

        // // I'm commenting this out so that an admin can update a category that another admin created
        // if (category.user_id != id) {
        //     return res.json({success: false, message: 'You are not authorized to perform this action'})
        // }

        const updatedCategory = await CategoryModel.findByIdAndUpdate(categoryId , updateDetails , {new: true})
        
        res.json({success: true, message: 'Category updated successfully'})
      
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

        // // I'm commenting this out so that an admin can delete a category that another admin created
        // if (category.user_id != id) {
        //     return res.json({success: false, message: 'You are not authorized to perform this action'})
        // }

        await ProductModel.deleteMany({category_id: category._id})

        const deletedCategory = await CategoryModel.findOneAndDelete({_id: categoryId})
        
        res.json({success: true, message: 'Category deleted successfully'})
      
    } catch (error) {
        res.json({success: false, error: error.message})
    }
}

module.exports = {
    userToAdmin,
    deleteUserById,
    verifyUser,
    deleteProductById,
    createCategory,
    updateCategory,
    deleteCategory
}