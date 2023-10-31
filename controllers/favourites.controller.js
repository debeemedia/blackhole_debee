const Products = require('../models/product.model');
const Favourites = require('../models/favouriteModel')


async function createFavourites (req, res){
    try {
      const { productId } = req.body;
      
      const product = await Products.findById(productId);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      const existingFavourite = await Favourites.findOne({ user: req.user.id, product: productId });
  
      if (existingFavourite) {
        return res.status(400).json({ error: 'Product is already in favourites' });
      }
  
      const favourite = new Favourites({
        user: req.user.id,
        product: productId
      });
  
      await favourite.save();
      res.json({ message: 'Added to favorites' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  // Get a user's favorites
async function getUserFavourites (req, res){
    try {
        const userId = request.user.id
      const favorites = await Favourites.find({ user: userId }).populate('product');
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  // Remove a favorite
  async function deleteFavourite (req, res){
    try {
        const favId = request.params.id
        if(!favId){
            return res.json({success: false, message: 'please provide favourite ID'})
        }
      const favorite = await Favourites.findById(favId);
  
      if (!favorite) {
        return res.status(404).json({ error: 'Favorite not found' });
      }
  
      if (favorite.user.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
  
      await favorite.remove();
      res.json({ message: 'Removed from favorites' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  module.exports = {createFavourites, getUserFavourites, deleteFavourite};