// require('dotenv').config()
// const multer = require('multer')
// const cloudinary = require('cloudinary').v2
// const {CloudinaryStorage} = require('multer-storage-cloudinary')

// // configure cloudinary
// cloudinary.config({
//     secure: true,
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// })

// // configure the storage engine for profile images
// const profile_storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'aphia-dev/profile-images',
//         transformation: [{width: 500, height: 500, crop: 'limit'}]
//     }
// })

// // create a multer instance of the profile image storage
// const profile_upload = multer({
//     storage: profile_storage,
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
//           cb(null, true);
//         } else {
//           cb(new Error('Invalid file format. Only JPEG and PNG images are allowed.'), false);
//         }
//       }
// })

// // configure the storage engine for product images
// const product_storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'aphia-dev/product-images',
//         transformation: [{width: 1000, height: 1000, crop: 'limit'}]
//     }
// })

// // create a multer instance of the product image storage
// const product_upload = multer({
//     storage: product_storage,
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
//           cb(null, true);
//         } else {
//           cb(new Error('Invalid file format. Only JPEG and PNG images are allowed.'), false);
//         }
//       }
// })

// module.exports = {profile_upload, product_upload}

// ////////////

// REFACTORED
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

function createMulterInstance (folder, transformation) {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder,
      transformation: transformation
    }
  })
  return multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
          cb(null, true);
        } else {
          cb(new Error('Invalid file format. Only JPEG and PNG images are allowed.'), false);
        }
      }
  })
}
const profile_upload = createMulterInstance('aphia-dev/profile-images', [{width: 500, height: 500, crop: 'limit'}])
const product_upload = createMulterInstance('aphia-dev/product-images', [{width: 1000, height: 1000, crop: 'limit'}])

module.exports = {profile_upload, product_upload}
