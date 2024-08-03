const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  address: [
    {
      street: { type: String, required: true },
      // city: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      pincode: { type: String, required: true },
    },
  ],
  password: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if the model is already compiled, and use it if it exists, otherwise define it
const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;
