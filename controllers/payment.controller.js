require('dotenv').config()
const axios = require('axios');
const UserModel = require('../models/user.model');
const {v4: uuidv4} = require('uuid');
const Order = require('../models/order.model');
const PaymentModel = require('../models/payment.model');
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
        // // verify the authenticity of webhook payload (if it is from flutterwave)
        if (!signature || signature != secretHash) {
            return res.status(401).json({success: false, message: 'No/Invalid webhook secret hash'})
        }

        // get payload from flutterwave
        const payload = req.body
        console.log(payload);

        // find customer details from database
        const email = payload.data.customer.email
        const user = await UserModel.findOne({email})
        const user_id = user._id
        const order = await Order.findOne({user_id})
        const order_id = order._id

        // check if payment was successful
        if (payload.data.status !== 'successful') {
            console.log('Payment unsuccessful')
        }

        if (payload.data.status === 'successful' && payload.data.charged_amount >= payload.data.amount) {
            // create a payment record in the database
            const paymentData = {
                user_id,
                order_id,
                transaction_id: payload.data.tx_ref,
                payment_gateway: 'Flutterwave',
                payment_method: 'Bank transfer',
                amount: payload.data.amount,
                currency: payload.data.currency,
                status: 'completed'
            }
            await PaymentModel.create(paymentData)
            
            // update order status in the database
            await OrderModel.findByIdAndUpdate(order_id, {completed: true}, {new: true})
        }

        // acknowledge receipt of webhook by returning 200 status code to flutterwave
        res.status(200)

    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: true, message: 'Internal server error'})
    }
}

module.exports = {initiatePayment, listenWebhook}
