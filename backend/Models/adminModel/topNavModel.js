const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true },
});

const topNavSchema = mongoose.Schema({
  title: { type: String, required: true },
  phone: { type: String, required: true },
  mobileNo: { type: String, required: true },
  email: { type: String, required: true },
  addresses: [addressSchema],
});

const topNavModel = mongoose.model("topNavbar", topNavSchema);

module.exports = topNavModel;
