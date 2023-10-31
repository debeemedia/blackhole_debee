require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const router = require('./routes/routes')
const connectToMongoDB = require('./db/connect')
const { ROUTE_HOME } = require('./lib/page-route')
const path = require('path')

const app = express()
app.use(express.static(path.join(__dirname, 'public')))
const PORT = process.env.PORT || 5000
const mongoURL = process.env.MONGODB_URL || 'please enter your mongo db connection string in the created .env file'

app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.get(ROUTE_HOME, async(req, res)=>{
    return res.send('You are on your way to building one of the most beautiful things the world has ever seen.')
})
app.set('views', './views')
app.set('view engine', 'ejs')
app.use('/api', router)

// Error handling middleware
app.use((err, req, res, next) => {
    if (err) {
      res.json({ success: false, message: err.message });
    }
    next();
});

app.listen(PORT, async ()=>{
    console.log(`Server running on port ${PORT}`)
    await connectToMongoDB(mongoURL)
})