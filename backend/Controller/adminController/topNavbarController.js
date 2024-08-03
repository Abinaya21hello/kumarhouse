const topNavbarModel = require("../../Models/adminModel/topNavModel");
const { check, validationResult } = require("express-validator");

const userRegisterValidationRules = () => {
  return [
    check("title").not().isEmpty().withMessage("Name is required"),
    check("phone")
      .not()
      .isEmpty()
      .withMessage("Phone is required")
      .isNumeric()
      .withMessage("Phone must contain only numbers"),
    check("mobileNo")
      .not()
      .isEmpty()
      .withMessage("Mobile Number is required")
      .isNumeric()
      .withMessage("Mobile must contain only numbers"),
    check("email")
      .isEmail()
      .withMessage("Invalid email")
      .custom(async (email) => {
        const existingUser = await topNavbarModel.findOne({ email });
        if (existingUser) {
          throw new Error("Email already registered");
        }
      }),
    check("addresses")
      .isArray({ min: 1 })
      .withMessage("At least one address is required"),
    check("addresses.*.street")
      .not()
      .isEmpty()
      .withMessage("Street is required"),
    check("addresses.*.city").not().isEmpty().withMessage("City is required"),
    check("addresses.*.state").not().isEmpty().withMessage("State is required"),
    check("addresses.*.country")
      .not()
      .isEmpty()
      .withMessage("Country is required"),
    check("addresses.*.pincode")
      .not()
      .isEmpty()
      .withMessage("Pincode is required"),
  ];
};

// Add topNavbar
const topNavControl = async (req, res) => {
  const { title, email, phone, mobileNo, addresses } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }
    const topNav = new topNavbarModel({
      title,
      email,
      phone,
      mobileNo,
      addresses,
    });
    await topNav.save();
    res.json({ message: "Top Nav Added Successfully", topNav });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Top Navbar
const getTopNav = async (req, res) => {
  try {
    const topNav = await topNavbarModel.find();
    res.json(topNav);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update top navbar
const updateNav = async (req, res) => {
  const { title, email, phone, mobileNo, addresses } = req.body;
  try {
    const topNav = await topNavbarModel.findByIdAndUpdate(
      req.params.id,
      { title, email, phone, mobileNo, addresses },
      { new: true }
    );
    res.json({ message: "Top Nav Updated Successfully", topNav });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete top nav
const deleteNav = async (req, res) => {
  try {
    await topNavbarModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Top Nav Deleted Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  topNavControl,
  userRegisterValidationRules,
  getTopNav,
  deleteNav,
  updateNav,
};
