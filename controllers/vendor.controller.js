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
    image,
    gender,
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
    return res.status(400).json(validateResult.data);
  }

  try {
    // vendor is an extension of user so we check the user model for existing email or username
    const existing = await UserModel.findOne({$or: [{email}, {username}]})

    if (!empty(existing)) {
      res.status(400).json({ success: false, message: "email or username already exists" });
    } else {
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
        image,
        gender,
      });
      await newVendor.save();

      // send a mail to vendor on successful registration
      const emailOption = {
        to: email,
        from: "Aphia",
        subject: "Registration Successful",
        html: await buildEmailTemplate("confirmation.ejs", newVendor),
      };
      await sendMail(emailOption, res);

      res
        .status(201)
        .json({ success: true, message: "vendor created succesfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "internal server error" });
  }
}

module.exports = {
    createVendor
};
