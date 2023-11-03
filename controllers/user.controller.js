const UserModel = require("../models/user.model");
const { empty } = require("../utils/helpers");
const { sendMail, buildEmailTemplate } = require("../utils/mail");
const validateData = require("../utils/validate");

async function createUser(req, res) {
  const {
    username,
    email,
    password,
    first_name,
    last_name,
    phone_number,
    security_question,
    security_answer,
    gender,
  } = req.body;
  const error = {};
  const validateRule = {
    username: "string|required|min:1",
    email: "email|required",
    password: "string|required|min:8",
    first_name: "string|required",
    last_name: "string|required",
    phone_number: "string|required"
  };
  const validateMessage = {
    required: ":attribute is required",
    string: ":attribute must be a string",
    "email.email": "Please provide a valid :attribute.",
    "username.min": "min min min",
  };

  const validateResult = validateData(req.body, validateRule, validateMessage);
  if (!validateResult.success) {
    return res.json(validateResult.data);
  }

  try {
    const existingEmail = await UserModel.findOne({email})
    const existingUsername = await UserModel.findOne({username})

    if (!empty(existingEmail)) {
      res.json({ success: false, message: "User with email address exists" });
    } else if (!empty(existingUsername)) {
      res.json({ success: false, message: "Username already taken" });
    }else {
      // access the uploaded file URL from req.file (uploaded by multer)
      const image_default_url = 'https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg'
      const image_url = req.file ? req.file.path : image_default_url
      
      const newUser = new UserModel({
        username,
        email,
        password,
        first_name,
        last_name,
        phone_number,
        role: 'user',
        security_question,
        security_answer,
        image: image_url,
        gender,
      });
      await newUser.save();

      // send a mail to user on successful registration
      const emailOption = {
        to: email,
        from: "Aphia",
        subject: "Registration Successful",
        html: await buildEmailTemplate("verify_email.ejs", newUser),
      };
      await sendMail(emailOption, res);

      res
        .json({ success: true, message: "user created successfully" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "internal server error" });
  }
}

async function getUsers(req, res) {
  try {
    const users = await UserModel.find();
    res.json({ success: true, message: users });
  } catch (error) {
    res.json(error);
  }
}

async function updateUser(req, res) {
    const { username, email, password, first_name, last_name, phone_number, business_name, account_number, bank, bank_code, account_name, gender } = req.body;
    // get the user id from the decoded user in jwt
    const userId = req.user.id;
    if(empty(userId)){
        return res.json({success: false, message: 'Something went wrong. Please try again'})
    }
    const user = await UserModel.findById(userId);
    if (!empty(username)) user.username = username;
    if (!empty(email)) user.email = email;
    if (!empty(password)) user.password = password;
    if (!empty(first_name)) user.first_name = first_name;
    if (!empty(last_name)) user.last_name = last_name;
    if (!empty(phone_number)) user.phone_number = phone_number;
    if (!empty(business_name)) user.business_name = business_name;
    if (!empty(account_number)) user.account_number = account_number;
    if (!empty(bank)) user.bank = bank;
    if (!empty(bank_code)) user.bank_code = bank_code;
    if (!empty(account_name)) user.account_name = account_name;
    if (req.file) {
      const image_url = req.file.path
      user.image = image_url
    }
    if (!empty(gender)) user.gender = gender;

    await user.save();

    res.json({ success: true, message: "user updated successfully" });
}

async function deleteUser(req, res) {
  try {
    // get the user id from the decoded user in jwt
  const userId = req.user.id;
  if(empty(userId)){
      return res.json({success: false, message: 'Something went wrong. Please try again'})
  }
  
  await UserModel.findByIdAndDelete(userId)

  res.json({ success: true, message: "user deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: "Internal Server error" });
  }
}

// Resend email
async function resendMail(req, res){
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const emailOption = {
      to: email,
      from: "Aphia",
      subject: "Registration Successful",
      html: await buildEmailTemplate("verify_email.ejs", user),
    };
    await sendMail(emailOption, res);

    res.json({ success: true, message: "Email resent successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Internal server error" });
  }
};


module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  resendMail
};