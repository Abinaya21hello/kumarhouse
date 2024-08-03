const express = require("express");
const router = express.Router();
const registerController = require("../../Controller/userController/Register");
const LoginController = require("../../Controller/userController/userLogin");
const ForgotPasswordController = require("../../Controller/userController/forgotPassword");
const UpdateResetPasswordController = require("../../Controller/userController/updateResetPassword");
const UserContacts = require("../../Controller/userController/userContactController");
const { auth } = require("../../Middleware/authMiddleware");
const userProfile = require("../../Controller/userController/userProfile");

router.post(
  "/register",
  registerController.userRegisterValidationRules(),
  registerController.userRegister
);

// OTP verification route
router.post("/verifyOtpAndRegister", registerController.verifyOtpAndRegister);

//login
router.post("/login", LoginController.LoginController);

//logout
router.get("/user-logout", auth, LoginController.LogoutController);

//user register
router.get("/get-user/:id", auth, userProfile.userGet);
router.delete("/delete-user-account/:id", auth, userProfile.deleteUser);
router.put(
  "/update-user-account/:id",
  auth,
  userProfile.userUpdateValidationRules(),
  userProfile.updateUser
);
router.get("/get-All-user", auth, userProfile.getAllUser);

//update user Password old to new
router.put(
  "/update-user-account-password/:id",
  auth,
  userProfile.passwordUpdateValidationRules(),
  userProfile.updatePassword
);

//password reset router
router.post("/forgot-password", ForgotPasswordController.forgotPassword);

router.post(
  "/update-password/:userId/:tokenId",
  UpdateResetPasswordController.UpdateResetPassword
);

//user Contacts form router
router.post(
  "/contact",

  UserContacts.contactValidationRules(),
  UserContacts.UserContact
);
router.get("/getcontact", UserContacts.GetUserContact);
// router.put("/contact/:id", product.auth, UserContacts.UpdateContact);

router.delete("/contact/:id", auth, UserContacts.DeleteContact);

module.exports = router;
