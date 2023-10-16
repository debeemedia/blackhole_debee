require('promise-dotenv').config()
const fs = require('fs')
const express = require('express')
const router = require('./routes')
const connectToMongoDB = require('./db/connect')
const sendEmail = require('./services/sendEmail')
const { ROUTE_HOME } = require('./lib/page-route')
const path = require('path')

const app = express()
app.use(express.static(path.join(__dirname, 'public')))
const PORT = process.env.PORT || 5000
const mongoURL = process.env.MONGODB_URL || 'please enter your mongo db connection string in the created .env file'

app.use(express.json())

app.get(ROUTE_HOME, (req, res)=>{
    const filePath = path.join(__dirname, 'public', 'email_templates', 'example.html')
    const emailFile = fs.readFileSync(filePath, 'utf-8')
    res.send('You are on your way to building one of the most beautiful things the world has even seen.')
})
app.use('/api', router)

app.listen(PORT, async ()=>{
    await connectToMongoDB(mongoURL)
    console.log(`Server running on port ${PORT}`)
})