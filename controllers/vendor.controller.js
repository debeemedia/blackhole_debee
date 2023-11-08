const UserModel = require("../models/user.model");
const VendorModel = require("../models/vendor.model");
const { empty } = require("../utils/helpers");
const { sendMail, buildEmailTemplate } = require("../utils/mail");
const validateData = require("../utils/validate");

async function createVendor(req, res) {
  const {
    username,
    email,
    password,
    first_name,
    last_name,
    phone_number,
    business_name,
    account_number,
    bank,
    bank_code,
    account_name,
    security_question,
    security_answer,
    gender,
    product_ids
  } = req.body;
  const error = {};
  const validateRule = {
    username: "string|required|min:1",
    email: "email|required",
    password: "string|required|min:8",
    first_name: "string|required",
    last_name: "string|required",
    phone_number: "string|required",
    business_name: "string|required",
    account_number: "string|required",
    bank: "string|required",
    bank_code: "string|required",
    account_name: "string|required",
  };
  const validateMessage = {
    required: ":attribute is required",
    string: ":attribute must be a string",
    "email.email": "Please provide a valid :attribute.",
    "username.min": "min min min",
  };

  const validateResult = validateData(req.body, validateRule, validateMessage);
  if (!validateResult.success) {
    return res.json({success: false, message: validateResult.data});
  }

  try {
    // vendor is an extension of user so we check the user model for existing email or username
    const existingEmail = await UserModel.findOne({email})
    const existingUsername = await UserModel.findOne({username})

    if (!empty(existingEmail)) {
      res.json({ success: false, message: "Vendor with email address exists" });
    } else if (!empty(existingUsername)) {
      res.json({ success: false, message: "Username already taken" });
    } else {
      // access the uploaded file URL from req.file (uploaded by multer)
      const image_default_url = 'https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg'
      const image_url = req.file ? req.file.path : image_default_url

      const newVendor = new VendorModel({
        username,
        email,
        password,
        first_name,
        last_name,
        phone_number,
        business_name,
        account_number,
        bank,
        bank_code,
        account_name,
        role: 'vendor',
        security_question,
        security_answer,
        image: image_url,
        gender,
        product_ids
      });
      await newVendor.save();

      // send a mail to vendor on successful registration
      const emailOption = {
        to: email,
        from: "Aphia",
        subject: "Registration Successful",
        html: await buildEmailTemplate("verify_email.ejs", newVendor),
      };
      await sendMail(emailOption, res);

      res
        .json({ success: true, message: "vendor created successfully" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "internal server error" });
  }
}

module.exports = {
    createVendor
};
