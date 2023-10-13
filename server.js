require('promise-dotenv').config()
const express = require('express')
const router = require('./routes')
const connectToMongoDB = require('./db/connect')
<<<<<<< HEAD
const sendEmail = require('./services/sendEmail')
=======
const { ROUTE_HOME } = require('./lib/page-route')
>>>>>>> 58e0b7725c775d2b475c0a889e27902fc10838fe

const app = express()
const PORT = process.env.PORT || 5000
const mongoURL = process.env.MONGODB_URL || 'please enter your mongo db connection string in the created .env file'

app.use(express.json())

<<<<<<< HEAD


app.get('/', (req, res)=>{
=======
app.get(ROUTE_HOME, (req, res)=>{
>>>>>>> 58e0b7725c775d2b475c0a889e27902fc10838fe
    res.send('You are on your way to building one of the most beautiful things the world has even seen.')
})
app.use('/api', router)

app.listen(PORT, async ()=>{
    await connectToMongoDB(mongoURL)
    console.log(`Server running on port ${PORT}`)
})