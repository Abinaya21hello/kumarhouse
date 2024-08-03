const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  category: String,
  models: [
    {
      mainProduct: String,
      subProduct: [
        {
          subproductname: String,
          shortdescription: String,
          briefDescription: String,
          currentPrice: String,
          offerPrice: String,
          grams: String,
          Stock: String,
          TopSelling: Boolean,
          ratings: Number,
          image: String, // Store image URLs here
        },
      ],
    },
  ],
});

// Check if the model is already compiled, and use it if it exists, otherwise define it
module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);
