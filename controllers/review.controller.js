
const {ReviewModel} = require('../models/review.model')
const ProductModel = require('../models/product.model')
const UserModel = require('../models/user.model')
const { empty } = require("../utils/helpers")
const validateData = require("../utils/validate")

async function addReview(req,res){
    try {
        const {id} = req.user
        const {productId} = req.params
        const {comment, rating} = req.body

        if (empty(productId)) {
            return res.json({success: false, message: 'Please provide product ID'})
        }

        const error = {};
        const validateRule = {
            comment: "string|required",
            rating: "required"
        };
        const validateMessage = {
            required: ":attribute is required",
            string: ":attribute must be a string"
        };

        const validateResult = validateData(req.body, validateRule, validateMessage);
        if (!validateResult.success) {
            return res.json(validateResult.data);
        }

        const product = await ProductModel.findById(productId)
        if (!product) {
            return res.json({success: false, message: 'Product not found'})
        }

        if (rating < 0.5 || rating > 5) {
            return res.json({success: false, message: 'Rating must be from 1 to 5'})
        }

        const existingReview = await ReviewModel.findOne({product_id: productId, user_id: id})
        if (existingReview) {
            return res.json({success: false, message: 'You have already reviewed this product'})
        }

        const newReview = new ReviewModel({product_id: productId, user_id: id, comment, rating: +rating})
        await newReview.save()

        res.json({success: true, message: 'Review added successfully'})
      
    } catch (error) {
        res.json({success: false, error: error.message})
    }
}

async function getProductReviews(req,res){
    try {
        const {productId} = req.params

        if (!productId) {
            return res.json({success: false, message: 'Please provide product ID'})
        }

        const product = await ProductModel.findById(productId)
        if (!product) {
            return res.json({success: false, message: 'Product not found'})
        }

        const reviews = await ReviewModel.find({product_id: productId})
        if (reviews.length === 0) {
            return res.json({success: false, message: 'Product has no reviews'})
        }

        const reviewArr = []

        for (const review of reviews) {
            const user = await UserModel.findById(review.user_id)
            const eachReview = {_id: review._id, comment: review.comment, rating: review.rating, by: user.first_name, added: review.createdAt, edited: review.updatedAt}

            reviewArr.push(eachReview)
        }

        res.json({success: true, message: reviewArr})
      
    } catch (error) {
        res.json({success: false, error: error.message})
    }
}

async function updateReview(req,res){
    try {
        const {id} = req.user
        const {reviewId} = req.params
        const {comment, rating} = req.body

        if (!comment && !rating) {
            return res.json({success: false, message: 'Please provide at least a field'})
        }

        if (!reviewId) {
            return res.json({success: false, message: 'Please provide review ID'})
        }
        
        const review = await ReviewModel.findById(reviewId)
        if (!review) {
            return res.json({success: false, message: 'Review not found'})
        }

        if (review.user_id != id) {
            return res.json({success: false, message: 'You are not authorized to perform this action'})
        }
        
        const updateDetails = {}
        if (comment) {
            updateDetails.comment = comment
        }

        if (rating) {
            if (rating < 0.5 || rating > 5) {
                return res.json({success: false, message: 'Rating must be from 1 to 5'})
            }
            updateDetails.rating = +rating
        }

        const updatedReview = await ReviewModel.findByIdAndUpdate(reviewId, updateDetails, {new: true})
        

        res.json({success: true, message: 'Review updated successfully'})
      
    } catch (error) {
        res.json({success: false, error: error.message})
    }
}

async function deleteReview(req,res){
    try {
        const {id} = req.user
        const {reviewId} = req.params
        
        if (!reviewId) {
            return res.json({success: false, message: 'Please provide review ID'})
        }
        
        const review = await ReviewModel.findById(reviewId)
        if (!review) {
            return res.json({success: false, message: 'Review not found'})
        }

        if (review.user_id != id) {
            return res.json({success: false, message: 'You are not authorized to perform this action'})
        }

        const deletedReview = await ReviewModel.findByIdAndDelete(reviewId)
        
        res.json({success: true, message: 'Review deleted successfully'})
      
    } catch (error) {
        res.json({success: false, error: error.message})
    }
}

async function getVendorReviews(req, res){
    try {
        const {id} = req.user
        const reviews = await ReviewModel.find().populate('user_id product_id');

        if (reviews.length == 0) {
            res.json({success: false, message: `No review found`})
        }

        const reviewDetails = []

        for (const review of reviews) {

            if (review.product_id.user_id != id) {
                continue
            }

            const details = {comment: review.comment, rating: review.rating, by: review.user_id.username, product: review.product_id.name, date: review.createdAt}

            reviewDetails.push(details)
        }

        if (reviewDetails.length == 0) {
            res.json({success: false, message: `You have no review for any of your products`})
        }

        res.json({success: true, message: reviewDetails})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: `Internal server error`})
    }
}

module.exports = {
    addReview,
    getProductReviews,
    updateReview,
    deleteReview,
    getVendorReviews
}