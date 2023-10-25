const UserModel = require("../models/user.model");
const User = require("../models/user.model");
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
    const emailExist = await User.findOne({ email: email });

    if (!empty(emailExist)) {
      res.status(400).json({ success: false, message: "email already exists" });
    } else {
      const newUser = new User({
        username,
        email,
        password,
        first_name,
        last_name,
        security_question,
        security_answer,
        image,
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
        .status(201)
        .json({ success: true, message: "user created succesfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "internal server error" });
  }
}
async function getUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, message: users });
  } catch (error) {
    res.status(500).json(error);
  }
}

async function updateUser(req, res) {
    const { username, email, password, first_name, last_name, image, gender } =req.body;
    const userId = req.user.id;
    if(empty(userId)){
        return res.status(404).json({success: false, message: 'Something went wrong. Please try again'})
    }
    const user = await UserModel.findById(userId);
    if (!empty(username)) user.username = username;
    if (!empty(email)) user.email = email;
    if (!empty(password)) user.password = password;
    if (!empty(first_name)) user.first_name = first_name;
    if (!empty(last_name)) user.last_name = last_name;
    if (!empty(image)) user.image = image;
    if (!empty(gender)) user.gender = gender;
    await user.save();
    res.status(200).json({ success: true, message: "user updated succesfully" });
}

module.exports = {
  createUser,
  getUsers,
  updateUser,
};