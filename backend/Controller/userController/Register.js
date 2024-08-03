const userModel = require("../../Models/userModel/User");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const { sendOtp, verifyOtp } = require("../../Config/OtpService");

// Validation rules for user registration
const userRegisterValidationRules = () => {
  return [
    check("name").notEmpty().withMessage("Name is required"),
    check("email")
      .isEmail()
      .withMessage("Invalid email")
      .custom(async (email) => {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
          throw new Error("Email already registered");
        }
      }),
    check("phone")
      .notEmpty()
      .withMessage("Phone is required")
      .isNumeric()
      .withMessage("Phone must contain only numbers"),
    check("gender").notEmpty().withMessage("Gender is required"),
    check("address").notEmpty().withMessage("Address is required"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    check("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ];
};

// Register user and send OTP
const userRegister = async (req, res) => {
  // Validate the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, phone, address, gender, password } = req.body;

    // Temporarily store user data and send OTP
    await sendOtp(email, { name, email, phone, address, gender, password });

    res.status(201).json({
      message: "OTP sent to email. Please verify to complete registration.",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: error.message });
  }
};

// Verify OTP and save user to database
const verifyOtpAndRegister = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const userData = await verifyOtp(email, otp);

    if (userData) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(userData.password, salt);

      const user = new userModel({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        gender: userData.gender,
        password: hashPassword,
      });

      await user.save();
      res.status(200).json({ message: "OTP verified and user registered." });
    } else {
      res.status(400).json({ message: "Invalid OTP." });
    }
  } catch (error) {
    // console.error("Error verifying OTP and registering user:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  userRegister,
  verifyOtpAndRegister,
  userRegisterValidationRules,
};
