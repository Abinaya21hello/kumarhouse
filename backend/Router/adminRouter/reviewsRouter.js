const express = require("express");
const router = express.Router();
const reviewsControllers = require("../../Controller/adminController/reviewsController");
const { auth } = require("../../Middleware/authMiddleware");

router.post(
  "/reviews",
  auth,
  reviewsControllers.uploadImage,
  reviewsControllers.resizeImage,
  reviewsControllers.addreviewsImagetoCloud,
  reviewsControllers.addReviews
);

// GET all reviews
router.get("/reviews", auth, reviewsControllers.getReviews);

// PUT (edit) a review by ID
router.put(
  "/update-reviews/:id",
  auth,
  reviewsControllers.uploadImage,
  reviewsControllers.resizeImage,
  reviewsControllers.addreviewsImagetoCloud,
  reviewsControllers.editReviews
);

// DELETE a review by ID
router.delete("/reviews/:id", auth, reviewsControllers.deleteReviews);
module.exports = router;
