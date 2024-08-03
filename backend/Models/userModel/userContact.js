const mongoose = require("mongoose");

const UserContactSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    //validation
  },
  email: {
    type: String,
    required: true,
    //spec
  },
  phone: {
    type: String,
    required: true,
  },
  //dont allow char
  category: {
    type: String,
    enum: ["General Enquiry", "Product", "Complaint", "Other"],
    default: "General Enquiry",
  },
  message: {
    type: String,
    required: true,

//validatiion min 10 words max 100
},
  location: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const userContactModel = mongoose.model("contact", UserContactSchema);

module.exports = userContactModel;
