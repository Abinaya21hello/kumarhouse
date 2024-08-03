const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Admin", // Ensure this matches your User model name
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 30 * 86400, // Token expires after 30 days
  },
});

// Define and export the Token model
const Token = mongoose.model("Token", tokenSchema); // Capitalize Token here

module.exports = Token;
