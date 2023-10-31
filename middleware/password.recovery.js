
const nodemailer = require('nodemailer')
const crypto = require('crypto');
const RecoverModel = require('../models/password-remodel');
const dotenv = require('promise-dotenv').config()
const {buildEmailTemplate, sendMail} = require('../utils/mail');
const UserModel = require('../models/user.model');


function generatePasswordResetToken() {
  const token = crypto.randomBytes(20).toString('hex')
  return token;
}


async function generateToken(req,res){
    const {email} = req.body
    const user = await UserModel.findOne({email})
    if(!user){
        return res.json({success: false, message: 'User not found' })
    }
  const user_id = user._id
  const resetToken = new RecoverModel({
    token: generatePasswordResetToken(),
    user_id
  })
  await resetToken.save()
  

  const mailOption = {
    from: 'cijeoma559@gmail.com',
    to: email,
    subject: 'Reset your password',
    html: await buildEmailTemplate('request_password_reset.ejs', {user, token:resetToken.token})
  }
  await sendMail(mailOption)
  res.json({succes: true, message: 'token expires in 5minutes, '})

  
}
    
 async function resetPassword (req, res){
  const {password } = req.body
  const email = req.query.email
  const token = req.query.token

  if (!password) {
    return res.json({ success: false, message: 'New password is required' });
  }


  const user = await UserModel.findOne({email});
  if (!user) {
    return res.json({success: false, message: 'user not found' });
  }
  const user_id = user._id
  const savedToken = await RecoverModel.findOne({user_id})
  if(!savedToken){
    return res.json({success: false, message: 'invalid or expired token' });
  }
  if(token != savedToken){
    return res.json({success: false, message: 'invalid token' });
  }
  user.password = password;
  await user.save()
  await RecoverModel.findByIdAndDelete(savedToken._id)
  if(Date.now() > savedToken.expTime){
    await RecoverModel.findByIdAndDelete(savedToken._id)  
  }  
   res.json({success: true, message: 'Password reset successfully' })

 }
  
module.exports={
  generateToken,
  resetPassword
}
