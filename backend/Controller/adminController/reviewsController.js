const Review = require("../../Models/adminModel/reviewSchema");
const multer = require("../../Cloudniary/Upload");
const sharp = require("sharp");
const cloudinary = require("../../Cloudniary/Cloud");

// Middleware to handle file uploads
const uploadImage = multer.single("file");

const resizeImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const resizedImage = await sharp(req.file.buffer)
      .resize(1450, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 50 })
      .toBuffer();
    req.image = resizedImage.toString("base64");
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error resizing image" });
  }
};

const addreviewsImagetoCloud = async (req, res, next) => {
  if (!req.image) return next();

  try {
    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${req.image}`,
      { folder: "To Add Offers" }
    );
    req.result = result;
    next();
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error uploading image to Cloudinary" });
  }
};

// Get reviews with pagination
const getReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 3;
    const skip = (page - 1) * limit;

    const reviews = await Review.find().skip(skip).limit(limit);
    const totalReviews = await Review.countDocuments();

    res.status(200).json({ reviews, totalReviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// Add a new review
const addReviews = async (req, res) => {
  try {
    const { name, district, stars, reviews } = req.body;

    if (!req.result) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newReview = new Review({
      name,
      image: req.result.secure_url,
      district,
      stars,
      reviews,
    });

    await newReview.save();
    return res.status(200).json(newReview);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Edit an existing review
const editReviews = async (req, res) => {
  const id = req.params.id;
  const { name, district, stars, reviews } = req.body;

  try {
    const existingReview = await Review.findById(id);
    if (!existingReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (name !== undefined) existingReview.name = name;
    if (district !== undefined) existingReview.district = district;
    if (stars !== undefined) existingReview.stars = stars;
    if (reviews !== undefined) existingReview.reviews = reviews;
    if (req.result && req.result.secure_url) {
      existingReview.image = req.result.secure_url;
    }
    await existingReview.save();
    return res.status(200).json(existingReview);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a review
const deleteReviews = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getReviews,
  resizeImage,
  uploadImage,
  addreviewsImagetoCloud,
  addReviews,
  editReviews,
  deleteReviews,
};