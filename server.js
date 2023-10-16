require('promise-dotenv').config()
const express = require('express')
const router = require('./routes')
const connectToMongoDB = require('./db/connect')
const { ROUTE_HOME } = require('./lib/page-route')

const app = express()
const PORT = process.env.PORT || 5000
const mongoURL = process.env.MONGODB_URL || 'please enter your mongo db connection string in the created .env file'

app.use(express.json())

app.get(ROUTE_HOME, (req, res)=>{
    res.send('You are on your way to building one of the most beautiful things the world has even seen.')
})
app.set('views', './views')
app.set('view engine', 'ejs')
app.use('/api', router)

app.listen(PORT, async ()=>{
    await connectToMongoDB(mongoURL)
    console.log(`Server running on port ${PORT}`)
})