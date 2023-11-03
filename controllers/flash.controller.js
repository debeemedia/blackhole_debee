const { FlashModel } = require("../models/flashSale.model")
const ProductModel = require("../models/product.model")



async function addToFlash(req, res){
    try {
        const {id} = req.user
        const {product_id, new_price} = req.body

        if(!product_id || !new_price){
            return res.json({success: false, message: `Please provide required fields`})
        }

        const existingFlash = await FlashModel.findOne({product: product_id})
        if (existingFlash) {
            return res.json({success: false, message: `Product already added to flash sale`})
        }

        const newFlash = new FlashModel({product_id, user_id: id, new_price})
        await newFlash.save()

        return res.json({success: true, message: `Product added to flash sale`})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

async function removeFromFlash(req, res){
    try {
        const {id} = req.user
        const {product_id} = req.body

        const flash = await FlashModel.findOne({product: product_id})
        if (!flash) {
            return res.json({success: false, message: `Product not found`})
        }

        if (flash.user_id != id) {
            return res.json({success: false, message: `You are not the vendor of this product`})
        }

        await flash.remove()
        res.json({success: true, message: `Product removed from flash sale successfully`})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

async function getFlashSales(req, res) {
    try {
        const flash = await FlashModel.find().populate('product').select('-__v')
        if(flash.length == 0){
            res.json({success: false, message: `No products in flash sales`})
        }

        res.json({success: true, message: flash})

    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}


module.exports = {
    getFlashSales,
    addToFlash,
    removeFromFlash
}