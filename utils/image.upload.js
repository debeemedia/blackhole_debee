require('dotenv').config()
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require('multer-storage-cloudinary')

// configure cloudinary
cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// configure the storage engine
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'aphia-dev/profile-images',
        transformation: [{width: 500, height: 500, crop: 'limit'}]
    }
})

// create a multer instance of the storage
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
          cb(null, true);
        } else {
          cb(new Error('Invalid file format. Only JPEG and PNG images are allowed.'), false);
        }
      }
})

module.exports = upload
