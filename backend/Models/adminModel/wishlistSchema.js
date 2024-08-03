const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishlistItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  subProductId: {
    type: Schema.Types.ObjectId,
    ref: "Product.models.subProduct",
  },
  modelId: { type: Schema.Types.ObjectId, ref: "Product.models" },
  subproductname: String,
  shortdescription: String,
  briefDescription: String,
  image: String,
  price: Number,
  grams: Number,
  quantity: Number,
  // total: Number,
  Stock: String,
});

const wishlistSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  Wishlist: [wishlistItemSchema],
});

module.exports =
  mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);
