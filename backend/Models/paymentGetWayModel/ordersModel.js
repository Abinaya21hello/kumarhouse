const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  users: [
    {
      userName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
  ],
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      modelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      subProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      ProductImage: { type: String, required: true },
      ProductName: { type: String, required: true },
      grams: { type: String, required: true },
      currentPrice: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  order_id: {
    type: String,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  receipt: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    enum: ["created", "paid", "failed", "pending", "success", "cancelled"],
    default: "created",
  },
  deliveryAddress: {
    street: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  method: {
    type: String,
    required: true,
    enum: ["razorpay", "cod", "gpay"],
  },
  deliveryStatus: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deliveryDate: {
    type: Date,
    default: function () {
      const deliveryDate = new Date(this.createdAt);
      deliveryDate.setDate(deliveryDate.getDate() + 5);
      return deliveryDate;
    },
  },
});

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
