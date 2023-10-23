require('dotenv').config()
const axios = require('axios');
const UserModel = require('../models/user.model');
const {v4: uuidv4} = require('uuid');
const Order = require('../models/order.model');
const base_api_url = 'https://api.flutterwave.com/v3'

// function to initiate payment
async function initiatePayment (req, res) {
    try {
        // find the id of the logged-in user
        const user_id = req.user.id
        // find the user from the database
        const user = await UserModel.findById(user_id)

        // payment details
        const paymentData = {
            amount: 1000,
            currency: 'NGN',
            email: user.email,
            tx_ref: `TXN-${uuidv4()}`,
            narration: 'Aphia'
        }

        // make a post request to flutterwave api endpoint for transfer charge
        axios.post(`${base_api_url}/charges?type=bank_transfer`, JSON.stringify(paymentData), {
            headers: {
                'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log(response.data)
        })
        .catch(error => {
            console.log(error);
        })

        console.log(paymentData.tx_ref);

        res.status(200).json({success: true, message: 'Payment initiated successfully'})
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: true, message: 'Internal server error'})
    }
}
// webhook for flutterwave to listen for payment and make post request
async function listenWebhook (req, res) {
    try {
        // use secret hash in the webhook
        const secretHash = process.env.FLUTTERWAVE_WEBHOOK_HASH
        const signature = req.headers['verif-hash']
        // // verify the authenticity of webhook (if it is from flutterwave)
        // if (!signature || signature != secretHash) {
        //     return res.status(401).json({success: false, message: 'No/Invalid webhook secret hash'})
        // }

        // get payload from flutterwave
        const payload = req.body
        console.log(payload);

        // find customer details from database
        const email = payload.customer.email
        const user = await UserModel.findOne({email})
        const user_id = user._id
        const order = await Order.findOne({user_id})

        // check if payment was successful
        if (payload.status !== 'successful') {
            console.log('Payment unsuccessful')
        }

        // check if payment is in full
        if (payload.charged_amount < payload.amount) {
            console.log(`Payment incomplete. Amount to pay: ${payload.amount}. Amount paid: ${payload.charged_amount}`)
        }

        if (payload.status === 'successful' && payload.charged_amount >= payload.amount) {
            // update order status in the database
            await OrderModel.findByIdAndUpdate(order._id, {completed: true}, {new: true})
        }

        // acknowledge receipt of webhook by returning 200 status code to flutterwave
        res.status(200).end()

    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: true, message: 'Internal server error'})
    }
}

module.exports = {initiatePayment, listenWebhook}
