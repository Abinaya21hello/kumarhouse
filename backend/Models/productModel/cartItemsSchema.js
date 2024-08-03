  const mongoose = require("mongoose");

  // Define the cart item schema
  const cartItemSchema = new mongoose.Schema({
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    modelId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    subProductId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    subproductname: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    grams: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    Stock: {
      type: String,
      required: true,
    },
  });

  // Define the cart schema
  const cartSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      cartItems: [cartItemSchema],
    },
    { timestamps: true }
  );

  // Define and export the CartItems model
  const CartItems =
    mongoose.models.CartItems || mongoose.model("CartItems", cartSchema);

  module.exports = CartItems;
