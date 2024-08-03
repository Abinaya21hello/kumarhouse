const express = require("express");
const router = express.Router();
const wishlistController = require("../../Controller/adminController/wishcartController");
const { auth } = require("../../Middleware/authMiddleware");

//post
router.post(
  "/add/wishlist/:productId/models/:modelId/subProduct/:subProductId",
  wishlistController.addToWishlist
);

// get user id
router.get(
  "/get-user-wishlist/:userId",
  wishlistController.getWishlistspecificUser
);

//user product id delete
router.delete(
  "/delete-user-cartId/:userId/wishlist/:cartId",
  wishlistController.removeWishlistItem
);

//user all wishlist item delete
router.delete(
  "/delete-user-all-wishlist/:userId",
  wishlistController.deleteUserAllWishListItems
);

module.exports = router;
