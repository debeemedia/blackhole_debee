const express = require('express');
const app = express()
const { resetPassword, generateToken } = require('../middleware/password.recovery');


app.post('/forgot-password', generateToken)
app.post('/reset-password', resetPassword)