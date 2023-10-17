require('promise-dotenv').config()
const fs = require('fs')
const express = require('express')
const router = require('./routes')
const connectToMongoDB = require('./db/connect')
const { ROUTE_HOME } = require('./lib/page-route')
const path = require('path')
const mailBuilder = require('./utils/mailBuilder')
const { renderWelcomeMessage, sendMail } = require('./utils/mail')

const app = express()
app.use(express.static(path.join(__dirname, 'public')))
const PORT = process.env.PORT || 5000
const mongoURL = process.env.MONGODB_URL || 'please enter your mongo db connection string in the created .env file'

app.use(express.json())

app.get(ROUTE_HOME, async(req, res)=>{
    const mailFile = mailBuilder('example.html')

    // renderWelcomeMessage('promise', {email: 'chiemelapromise30@gmail.com'})
    const emailResult = await sendMail({
        to: 'chiemelapromise30@gmail.com',
         from: 'admin',
          subject: 'Confirmation Email',
           html: '<h1>Title</h1>'
    })
    if(emailResult){
        return res.send('You are on your way to building one of the most beautiful things the world has even seen.')
    }
    return res.json('Something went wrong')
})
app.set('views', './views')
app.set('view engine', 'ejs')
app.use('/api', router)

app.listen(PORT, async ()=>{
    await connectToMongoDB(mongoURL)
    console.log(`Server running on port ${PORT}`)
})