
require('dotenv').config()
const Flutterwave = require('flutterwave-node-v3')
const validateData = require("../utils/validate");

async function verifyBank (req, res) {
    try {
        // destructure request body
        const {account_number, account_bank} = req.body
        const flw = new Flutterwave('public key', process.env.FLUTTERWAVE_SECRET_KEY);
        
        // validate input
        const validateRule = {
            account_number: "string|required",
            account_bank: "string|required"
        };
        const validateMessage = {
            required: ":attribute is required",
            string: ":attribute must be a string"
        };
        
        const validateResult = validateData(req.body, validateRule, validateMessage);
          if (!validateResult.success) {
            return res.json(validateResult.data);
        }
        // check that account bank (the bank code) length is 3 characters else flutterwave will throw eror
        if (account_bank.length !== 3) {
            return res.json({success: false, message: 'account_bank length must be 3 characters long'})
        }

        // verify account number with flutterwave SDK and send a response
        const payload = {'account_number': account_number, 'account_bank': account_bank}
        const response = await flw.Misc.verify_Account(payload);

        // console.log(response);
        if (response && response.status === 'success') {
            return res.json({success: true, message: response.data})
        } else if (response.status === 'error') {
            return res.json({success: false, message: response.message})
            // // some error messages from flutterwave
            //     message: 'Sorry, that account number is invalid, please check and try again'
            //     message: 'Unknown Bank Code'
              
        }
        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: 'Internal server error'})
    }
}

module.exports = {verifyBank}
