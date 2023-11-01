
const express = require('express')
const { ROUTE_FAVORITE_ADD, ROUTE_FAVORITE_REMOVE, ROUTE_FAVORITE_GET } = require('../lib/page-route')
const { authenticate } = require('../middleware/auth')
const { createFavourites, deleteFavourite, getUserFavourites } = require('../controllers/favourites.controller')
const router = express.Router()


router.post(ROUTE_FAVORITE_ADD, authenticate, createFavourites)
router.delete(ROUTE_FAVORITE_REMOVE, authenticate, deleteFavourite)
router.get(ROUTE_FAVORITE_GET, authenticate, getUserFavourites)


module.exports.favoritesRouter = router