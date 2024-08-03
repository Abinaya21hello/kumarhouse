const express = require("express");
const {
  LoginController,registerAdmin,getAllAdmins,deleteAdmin
} = require("../../Controller/adminController/AdminregistrationController");
// const { registerAdmin, loginAdmin,forgotPasswordAdmin } = require('../../Controller/adminController/AdminregistrationController');
// const auth = require("../../Middleware/authMiddleware");

const router = express.Router();

router.post('/registerforadmin', registerAdmin);
// router.post('/loginforadmin', loginAdmin);
// router.post("/forgot-password", forgotPasswordAdmin);

router.post("/loginforadmin", LoginController);
router.delete("/deleteadmin/:id", deleteAdmin);
router.get("/gettheadmins", getAllAdmins);
router.delete("/deleteadmin/:id", deleteAdmin);




module.exports = router;