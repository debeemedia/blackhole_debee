require('dotenv').config()
const axios = require('axios');
const UserModel = require('../models/user.model');
const {v4: uuidv4} = require('uuid');
const Order = require('../models/order.model');
const PaymentModel = require('../models/payment.model');
const OrderModel = require('../models/order.model');
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
        .then(response => {
            console.log(response.data)
            console.log('tx_ref:', paymentData.tx_ref);
            res.json({success: true, message: 'Order created and payment initiated successfully', orderId, paymentInitiation: response.data})
        })
        .catch(error => {
            console.log(error);
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

        // check if payment was successful
        if (payload.data.status !== 'successful') {
            console.log('Payment unsuccessful')
        }

        if (payload.data.status === 'successful' && payload.data.charged_amount >= payload.data.amount) {
            // create a payment record in the database
            const paymentData = {
                user_id: userId,
                order_id: orderId,
                transaction_id: payload.data.tx_ref,
                payment_gateway: 'Flutterwave',
                payment_method: 'Bank transfer',
                amount: payload.data.amount,
                currency: payload.data.currency,
                status: 'completed'
            }
            await PaymentModel.create(paymentData)
            
            // update order status in the database
            await OrderModel.findByIdAndUpdate(orderId, {completed: true}, {new: true})
        }

        // acknowledge receipt of webhook by returning 200 status code to flutterwave
        res.status(200)

    } catch (error) {
        console.log(error.message);
        res.json({success: true, message: 'Internal server error'})
    }
}

module.exports = {initiatePayment, listenWebhook}
