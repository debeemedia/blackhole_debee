
const mongoose = require('mongoose')

const connectToMongoDB = async(url)=>{
    mongoose.connect(url)
    .then(()=>console.log('Database is connected'))
    .catch(err=> console.log(err, 'from DB'))
}

module.exports = connectToMongoDB