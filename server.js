const express = require('express')
const router = require('./routes')
const connectToMongoDB = require('./db/connect')

const app = express()
const PORT = process.env.PORT || 5000
const mongoURL = process.env.MONGODB_URL || 'please enter your mongo db connection string in the created .env file'

app.use(express.json())

app.get('/', (req, res)=>{
    res.send('You are on your way to building one of the most beautiful things the world has even seen.')
})
app.use('/api', router)

app.listen(PORT, async ()=>{
    await connectToMongoDB(mongoURL)
    console.log(`Server running on port ${PORT}`)
})