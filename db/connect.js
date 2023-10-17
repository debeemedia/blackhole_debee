const { default: mongoose } = require("mongoose")

async function connectToMongoDB(url){
    await mongoose.connect(url).then(()=>{
        console.log('Connected to DB 🚀🚀🚀🚀🌎')
    }).catch(error=>console.log('Error from DB', error))
}

module.exports = connectToMongoDB