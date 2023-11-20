const UserModel = require("../models/user.model");
const { empty } = require("../utils/helpers");
const validateData = require("../utils/validate");

async function upgradeUserToVendor(req, res) {
    try {

        const {business_name, account_number, bank, bank_code, account_name} = req.body
        const error = {};
        const validateRule = {
            business_name: "string|required",
            account_number: "string|required",
            bank: "string|required",
            bank_code: "string|required",
            account_name: "string|required",
        };
        const validateMessage = {
            required: ":attribute is required",
            string: ":attribute must be a string"
        };

        const validateResult = validateData(req.body, validateRule, validateMessage);
        if (!validateResult.success) {
            return res.json({ success: false, message: validateResult.data });
        }
  
        const userId = req.user.id;
        const user = await UserModel.findById(userId);
    
        if (empty(user)) {
            return res.json({ success: false, message: 'User not found' });
        }
    
        // Check if the user is already a vendor
        if (user.role === 'vendor') {
            return res.json({ success: false, message: 'User is already a vendor' });
        }
    
        // Update user with vendor details
        user.set({
            business_name,
            account_number,
            bank,
            bank_code,
            account_name,
            role: 'vendor',
            __t: 'Vendor'
        });
    
        await user.save();
    
        res.json({ success: true, message: 'User upgraded to vendor successfully' });
  
    } catch (error) {
      console.error(error.message);
      res.json({ success: false, message: 'Internal server error' });
    }
  }
  
module.exports = {upgradeUserToVendor}
