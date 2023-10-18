const express = require('express');
const app = express()
const { forgetPassword, resetPassword } = require('../middleware/password.recovery');


app.post('/forgot-password', forgetPassword)
app.post('/reset-password', resetPassword)