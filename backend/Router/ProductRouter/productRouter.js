const express = require("express");
const router = express.Router();

const productsControllers = require("../../Controller/productController/offerPage");

const cartProductController = require("../../Controller/productController/cartItemController");

const { auth } = require("../../Middleware/authMiddleware");

// Create a new offer
router.post(
  "/offer",
  auth,
  productsControllers.uploadImage,
  productsControllers.resizeImage,
  productsControllers.addOfferImageToCloud,
  productsControllers.addOffer
);

// Get all offers

router.get("/getoffer", productsControllers.getOffer);

// Update an existing offer
router.put(
  "/offer/:id",

  auth,

  productsControllers.uploadImage,
  productsControllers.resizeImage,
  productsControllers.addOfferImageToCloud,
  productsControllers.updateOffer
);
// Delete an offer

router.delete("/offer/:id", auth, productsControllers.deleteOffer);

module.exports = router;
