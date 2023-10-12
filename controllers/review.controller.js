const mongoose = require('mongoose')
const {ReviewModel} = require('../models/review.model')
const ProductModel = require('../models/product_model')
const UserModel = require('../models/user.model')


async function addReview(req,res){
    try {
        const {_id} = req.user
        const productId = req.params.id
        const {comment, rating} = req.body

        if (!productId) {
            return res.status(400).json({success: false, message: 'Please provide product ID'})
        }

        const product = await ProductModel.findById(productId)
        if (!product) {
            return res.status(404).json({success: false, message: 'Product not found'})
        }

        const newReview = new ReviewModel({product_id: productId, user_id: _id, comment, rating})
        await newReview.save()

        res.status(201).json({success: true, message: 'Review added successfully'})
      
    } catch (error) {
        res.status(500).json({success: false, error: error.message})
    }
}

async function getProductReviews(req,res){
    try {
        const productId = req.params.id

        if (!productId) {
            return res.status(400).json({success: false, message: 'Please provide product ID'})
        }

        const product = await ProductModel.findById(productId)
        if (!product) {
            return res.status(404).json({success: false, message: 'Product not found'})
        }

        const reviews = await ReviewModel.find({product_id: productId})
        if (reviews.length === 0) {
            return res.status(404).json({success: false, message: 'Product has no reviews'})
        }

        const reviewArr = []

        for (const review of reviews) {
            const user = await UserModel.findById(review.user_id)
            const eachReview = {comment: review.comment, rating: review.rating, by: user.first_name, added: review.createdAt, edited: review.updatedAt}

            reviewArr.push(eachReview)
        }

        res.status(200).json({success: true, message: reviewArr})
      
    } catch (error) {
        res.status(500).json({success: false, error: error.message})
    }
}

async function updateReview(req,res){
    try {
        const {_id} = req.user
        const reviewId = req.params.id
        const {comment, rating} = req.body

        if (!comment && !rating) {
            return res.status(400).json({success: false, message: 'Please provide at least a field'})
        }

        
        if (!reviewId) {
            return res.status(400).json({success: false, message: 'Please provide review ID'})
        }
        
        const review = await ReviewModel.findById(reviewId)
        if (!review) {
            return res.status(404).json({success: false, message: 'Review not found'})
        }

        if (review.user_id == _id) {
            return res.status(401).json({success: false, message: 'You are not authorized to perform this action'})
        }
        
        const updateDetails = {}
        if (comment) {
            updateDetails.comment = comment
        }

        if (rating) {
            updateDetails.rating = rating
        }

        const updatedReview = ReviewModel.findByIdAndUpdate(reviewId, updateDetails, {new: true})
        

        res.status(200).json({success: true, message: 'Review updated successfully'})
      
    } catch (error) {
        res.status(500).json({success: false, error: error.message})
    }
}

async function deleteReview(req,res){
    try {
        const {_id} = req.user
        const reviewId = req.params.id
        
        if (!reviewId) {
            return res.status(400).json({success: false, message: 'Please provide review ID'})
        }
        
        const review = await ReviewModel.findById(reviewId)
        if (!review) {
            return res.status(404).json({success: false, message: 'Review not found'})
        }

        if (review.user_id == _id) {
            return res.status(401).json({success: false, message: 'You are not authorized to perform this action'})
        }

        const updatedReview = ReviewModel.findByIdAndDelete(reviewId)
        
        res.status(200).json({success: true, message: 'Review deleted successfully'})
      
    } catch (error) {
        res.status(500).json({success: false, error: error.message})
    }
}

module.exports = {
    addReview,
    getProductReviews,
    updateReview,
    deleteReview
}