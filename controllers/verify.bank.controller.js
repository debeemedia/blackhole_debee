
require('dotenv').config()
const Flutterwave = require('flutterwave-node-v3')
const validateData = require("../utils/validate");

async function verifyBank (req, res) {
    try {
        const {account_number, account_bank} = req.body
        const flw = new Flutterwave('public key', process.env.FLUTTERWAVE_SECRET_KEY);
       
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
        // const payload = {"account_number": "0690000032", "account_bank": "044"};
        const payload = {'account_number': account_number, 'account_bank': account_bank}
        const response = await flw.Misc.verify_Account(payload);
        // console.log(response);
        res.json({success: true, message: response.data})
        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: 'Internal server error'})
    }
}

module.exports = {verifyBank}
