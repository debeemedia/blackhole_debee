
const nodemailer = require('nodemailer');
const dotenv = require('promise-dotenv').config()


async function forgetPassword(req,res){
    const {email} = req.body
    const user = await user.findOne({email})
    if(!user){
        return res.status(404).json({success: false, message: 'User not found' })
    }
    const token = await generatePasswordResetToken()
  user.passwordResetToken = token;
  await user.save()

  const transporter = nodemailer.createTransport({
    auth: {
        user: 'cijeoma559@gmail.com',
        pass: process.env.NODEMAILER
    },
  });
  const mailOption = {
    from: 'cijeoma559@gmail.com',
    to: email,
    subject: 'Reset your password',
    text: `Click the following link to reset your password: ${app-link}/reset-password/${token}`,
  };
} 

  transporter.sendMail(mailOption, (err, info) => {
    if (err) {
      console.log(err);
      return res.status(500).json({success: false, message: 'Error sending email' });
    }

    return res.status(200).json({success: true, message: 'Email sent successfully' })
  });


 async function resetPassword (req, res){
  const { email, token, password } = req.body;

  const user = await user.findOne({ email, passwordResetToken: token });
  if (!user) {
    return res.status(401).json({success: false, message: 'Invalid password reset token' });
  }

  user.password = password;
  await user.save();

  return res.status(200).json({success: true, message: 'Password reset successfully' });
 }
  
module.exports={forgetPassword,
resetPassword
}