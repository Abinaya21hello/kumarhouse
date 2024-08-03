const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const refundSchema = new Schema({
  orderId: {
    type: String,
    ref: "Order",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["requested", "processing", "completed", "rejected"],
    default: "requested",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Refund", refundSchema);
