const express = require('express');
const { forgetPassword, resetPassword } = require('../middleware/password.recovery');
const app = express()


app.post('/forgot-password', forgetPassword)
app.post('/reset-password', resetPassword)