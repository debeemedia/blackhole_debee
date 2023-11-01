const Products = require('../models/product.model');
const Favourites = require('../models/favourite.model')


async function createFavourites (req, res){
    try {
      const { product_id } = req.body;
      const {id} = req.user

      if (!id) {
        return res.json({success: false, message: `Unauthorized, please log in`})
      }

      if(!product_id){
        return res.json({success: false, message: `Please provide required field`})
      }
      
      const product = await Products.findById(product_id);
  
      if (!product) {
        return res.json({success: false, message: 'Product not found' });
      }
  
      const existingFavourite = await Favourites.findOne({ user_id: id, product_id});
  
      if (existingFavourite) {
        return res.json({success: false, message: 'Product is already in favourites' });
      }
  
      const favourite = new Favourites({
        user_id: id,
        product_id
      });
  
      await favourite.save();
      res.json({success: true, message: 'Added to favorites' });
    } catch (error) {
      res.json({success: false, error: 'Internal server error' });
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