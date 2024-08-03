const mongoose = require("mongoose");

const productOfferSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  offerPercentage: {
    type: Number,
    required: true,
  },
  expireDate: {
    type: Date,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("ProductOffer", productOfferSchema);
