const Products = require('../models/product.model');
const Favourites = require('../models/favourite.model')


async function createFavourites(req, res) {
  try {
    const { product_id } = req.body;
    const { id } = req.user

    if (!id) {
      return res.json({ success: false, message: `Unauthorized, please log in` })
    }

    if (!product_id) {
      return res.json({ success: false, message: `Please provide required field` })
    }

    const product = await Products.findById(product_id);

    if (!product) {
      return res.json({ success: false, message: 'Product not found' });
    }

    const existingFavourite = await Favourites.findOne({ user_id: id, product: product_id });

    if (existingFavourite) {
      return res.json({ success: false, message: 'Product is already in favourites' });
    }

    const favourite = new Favourites({
      user_id: id,
      product: product_id
    });

    await favourite.save();
    res.json({ success: true, message: 'Added to favorites' });
  } catch (error) {
    res.json({ success: false, error: 'Internal server error' });
  }
};

// Get a user's favorites
async function getUserFavourites(req, res) {
  try {
    const userId = req.user.id
    const favorites = await Favourites.find({ user_id: userId }).populate('product').select('-__v');
    res.json({ success: true, message: favorites });
  } catch (error) {
    res.json({ success: false, error: 'Internal server error' });
  }
};

// Remove a favorite
async function deleteFavourite(req, res) {
  try {
    const { id } = req.user
    const { favoriteId } = req.params

    if (!id) {
      return res.json({ success: false, message: `Unauthorized, please log in` })
    }

    if (!favoriteId) {
      return res.json({ success: false, message: 'please provide favourite ID' })
    }

    const favorite = await Favourites.findById(favoriteId);

    if (!favorite) {
      return res.json({ success: false, message: 'Favorite not found' });
    }

    if (favorite.user_id != id) {
      return res.json({ success: false, message: 'You are not authorized to perform this action' });
    }

    await Favourites.findByIdAndDelete(favoriteId)
    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    res.json({ success: false, error: 'Internal server error' });
  }
};

module.exports = { createFavourites, getUserFavourites, deleteFavourite };