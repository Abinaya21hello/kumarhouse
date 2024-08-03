const express = require("express");
const router = express.Router();
const cartItemsController = require("../../Controller/productController/cartItemController");

router.post(
  "/add-cart/:productId/models/:modelId/subProduct/:subProductId",
  // cartItemsController.uploadImage,
  // cartItemsController.resizeImage,
  // cartItemsController.addCardImageToCloud,
  cartItemsController.addCart
);

router.get("/get-cart-product/:userId", cartItemsController.getCartProduct);

router.put(
  "/update-cart-item/:userId/cart/:cartId",
  cartItemsController.updateCartProduct
);

router.delete(
  "/delete-cart-item/:userId/cart/:cartId",
  cartItemsController.deleteCartProduct
);

router.delete("/delete-cart-item/:userId", cartItemsController.deleteCart);

module.exports = router;
