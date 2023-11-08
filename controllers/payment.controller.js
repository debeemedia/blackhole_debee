require('dotenv').config()
const axios = require('axios');
const UserModel = require('../models/user.model');
const {v4: uuidv4} = require('uuid');
const Order = require('../models/order.model');
const PaymentModel = require('../models/payment.model');
const OrderModel = require('../models/order.model');
const { empty } = require("../utils/helpers");
const base_api_url = 'https://api.flutterwave.com/v3'

// function to initiate payment
async function initiatePayment (req, res) {
    try {
        // find the id of the logged-in user
        const user_id = req.user.id
        // find the user from the database
        const user = await UserModel.findById(user_id)
        // get the order from the req.order passed in the createOrder middleware
        const order = req.order
        const orderId = order._id

        // payment details
        const paymentData = {
            amount: order.amount,
            currency: 'NGN',
            email: user.email,
            phone_number: user.phone_number,
            fullname: `${user.first_name} ${user.last_name}`,
            tx_ref: `TXN-${uuidv4()}`,
            narration: 'Aphia'
        }

        // update the order with the tx_ref
        await OrderModel.findByIdAndUpdate(orderId, {tx_ref: paymentData.tx_ref}, {new: true})

        // make a post request to flutterwave api endpoint for transfer charge
        axios.post(`${base_api_url}/charges?type=bank_transfer`, JSON.stringify(paymentData), {
            headers: {
                'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        })
        .then(async response => {
            console.log(response.data)
            console.log('tx_ref:', paymentData.tx_ref);
            // create a payment record in the database with status pending
            const payment = new PaymentModel({
                user_id,
                order_id: orderId,
                transaction_id: paymentData.tx_ref,
                payment_gateway: 'Flutterwave',
                payment_method: 'Bank transfer',
                amount: order.amount,
                currency: 'NGN',
                status: 'pending'
            })
            await payment.save()

            res.json({success: true, message: 'Order created and payment initiated successfully', orderId, transactionId: paymentData.tx_ref, paymentInitiation: response.data})
        })
        .catch(error => {
            console.log(error);
            res.json({success: false, message: 'Payment initiation unsuccessful'})
        })
        
    } catch (error) {
        console.log(error.message);
        res.json({success: true, message: 'Internal server error'})
    }
}

// webhook for flutterwave to listen for payment and make post request
async function listenWebhook (req, res) {
    try {
        // use secret hash in the webhook
        const secretHash = process.env.FLUTTERWAVE_WEBHOOK_HASH
        const signature = req.headers['verif-hash']
        // // verify the authenticity of webhook payload (if it is from flutterwave)
        if (!signature || signature != secretHash) {
            return res.json({success: false, message: 'No/Invalid webhook secret hash'})
        }

        // get payload from flutterwave
        const payload = req.body
        console.log(payload);

        // find customer details from database
        const email = payload.data.customer.email
        const user = await UserModel.findOne({email})
        const userId = user._id
        // find the order with the tx_ref we updated the database with
        const tx_ref = payload.data.tx_ref
        const order = await OrderModel.findOne({tx_ref})
        const orderId = order._id

        // create a payment record in the database
        const payment = await PaymentModel.findOne({transaction_id: tx_ref})
        const payment_id = payment._id

        // check if payment was successful
        if (payload.data.status === 'successful' && payload.data.charged_amount >= payload.data.amount) {
            
            
            // update payment status in the database to completed
            await PaymentModel.findByIdAndUpdate(payment_id, {status: 'completed'}, {new: true})

            
            // update order status in the database to completed
            await OrderModel.findByIdAndUpdate(orderId, {completed: true}, {new: true})

        } else if (payload.data.status === 'failed') {

            // update payment status in the database to failed
            await PaymentModel.findByIdAndUpdate(payment_id, {status: 'failed'}, {new: true})

        }

        // acknowledge receipt of webhook by returning 200 status code to flutterwave
        res.status(200)

    } catch (error) {
        console.log(error.message);
        res.json({success: true, message: 'Internal server error'})
    }
}

// function to retry payment
async function retryPayment (req, res) {
    try {
        // find the id of the logged-in user
        const user_id = req.user.id
        // find the user from the database
        const user = await UserModel.findById(user_id)
        // destructure the order id from the req.params and find the order
        const {orderId} = req.params
        const order = await OrderModel.findById(orderId)

        // payment details
        const paymentData = {
            amount: order.amount,
            currency: 'NGN',
            email: user.email,
            phone_number: user.phone_number,
            fullname: `${user.first_name} ${user.last_name}`,
            tx_ref: `TXN-${uuidv4()}`,
            narration: 'Aphia'
        }

        // update the order with the tx_ref
        await OrderModel.findByIdAndUpdate(orderId, {tx_ref: paymentData.tx_ref}, {new: true})

        // make a post request to flutterwave api endpoint for transfer charge
        axios.post(`${base_api_url}/charges?type=bank_transfer`, JSON.stringify(paymentData), {
            headers: {
                'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        })
        .then(async response => {
            console.log(response.data)
            console.log('tx_ref:', paymentData.tx_ref);
            // create a payment record in the database with status pending
            const payment = new PaymentModel({
                user_id,
                order_id: orderId,
                transaction_id: paymentData.tx_ref,
                payment_gateway: 'Flutterwave',
                payment_method: 'Bank transfer',
                amount: order.amount,
                currency: 'NGN',
                status: 'pending'
            })
            await payment.save()

            res.json({success: true, message: 'Payment initiated successfully', transactionId: paymentData.tx_ref, paymentInitiation: response.data})
        })
        .catch(error => {
            console.log(error);
            res.json({success: false, message: 'Payment initiation unsuccessful'})
        })
        
    } catch (error) {
        console.log(error.message);
        res.json({success: true, message: 'Internal server error'})
    }
}

// function to get a payment
async function getPayment (req, res){
    try {
        const user_id = req.user.id
        // destructure transaction id from req.params
        const {transactionId} = req.params

        if (empty(transactionId)) {
            return res.json({success: false, message: 'Please provide transaction ID'})
        }
        // find the payment with the transaction id
        const payment = await PaymentModel.findOne({transaction_id: transactionId}).select('-__v')
        if (empty(payment)) {
            return res.json({success: false, message: 'Payment is not found'})
        }

        if (payment.user_id != user_id) {
            return res.json({success: false, message: 'You are not authorized to access this resource'})
        }

        res.json({ success: true, message: payment })
    } catch (error) {
        res.json({success: false, error: error.message});
    }
}

module.exports = {initiatePayment, listenWebhook, retryPayment, getPayment}
