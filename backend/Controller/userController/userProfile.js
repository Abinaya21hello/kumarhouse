const userModel = require("../../Models/userModel/User");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

// validation rule
const userUpdateValidationRules = () => {
  return [
    check("name").optional().notEmpty().withMessage("Name is required"),
    check("email").optional().isEmail().withMessage("Invalid email"),
    // .custom(async (email, { req }) => {
    //   const user = await userModel.findOne({ email });
    //   if (user && user.id !== req.params.userId) {
    //     throw new Error("Email already registered");
    //   }
    // }),
    check("phone")
      .optional()
      .notEmpty()
      .withMessage("Phone is required")
      .isNumeric()
      .withMessage("Phone must contain only numbers"),
    check("gender").optional().notEmpty().withMessage("Gender is required"),
    check("address").optional().notEmpty().withMessage("Address is required"),
    check("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    check("confirmPassword")
      .optional()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),
  ];
};

// validation rule for password update
  
const passwordUpdateValidationRules = () => {
  return [
    check("oldPassword").notEmpty().withMessage("Old password is required"),
    check("newPassword")
      .notEmpty()
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
    check("confirmNewPassword")
      .notEmpty()
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error("New passwords do not match");
        }
        return true;
      }),
  ];
};

//getById user data
const userGet = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userModel.findById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error occurred while fetching user", error: err });
  }
};

//update user account
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, gender, address, password } = req.body;

  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }

  try {
    const userData = { name, email, phone, gender, address };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(password, salt);
    }

    const user = await userModel.findByIdAndUpdate(id, userData, { new: true });

    if (user) {
      res.status(200).json({ message: "updated successfully", user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error occurred while updating user",
      error: err.message,
    });
  }
};

// update user password

const updatePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }

  try {
    const user = await userModel.findById(id);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid old password" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Error occurred while updating password",
      error: err.message,
    });
  }
};

//delete user account
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findByIdAndDelete(id);
    if (user) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error occurred while deleting user", error: err });
  }
};

//get all user

const getAllUser = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error occurred while fetching users", error: err });
  }
};

module.exports = {
  userGet,
  deleteUser,
  updateUser,
  getAllUser,
  userUpdateValidationRules,
  updatePassword,
  passwordUpdateValidationRules,
};
