// ImageModel.js

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  name: String,
  district: String,
  stars: String,
  reviews: String,
  image: String,

  createdAt: { type: Date, default: Date.now }, // Automatically set created date
});

const Product = mongoose.model("review", reviewSchema);

module.exports = Product;
