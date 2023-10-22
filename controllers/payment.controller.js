require('dotenv').config()
const axios = require('axios');
const UserModel = require('../models/user.model');
const {v4: uuidv4} = require('uuid')
const base_api_url = 'https://api.flutterwave.com/v3'

async function initiatePayment (req, res) {
    try {
        const user_id = req.user.id
        const user = await UserModel.findById(user_id)

        const paymentData = {
            amount: 1000,
            currency: 'NGN',
            email: user.email,
            tx_ref: `TXN-${uuidv4()}`,
            narration: 'Aphia'
        }
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

async function listenWebhook (req, res) {
    try {
        const secretHash = process.env.FLUTTERWAVE_WEBHOOK_HASH
        const signature = req.headers['verif-hash']
        // if (!signature || signature != secretHash) {
        //     return res.status(401).json({success: false, message: 'No/Invalid webhook secret hash'})
        // }
        const payload = req.body
        console.log(payload);
        res.status(200).end()
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: true, message: 'Internal server error'})
    }
}

module.exports = {initiatePayment, listenWebhook}
