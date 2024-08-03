const express = require("express");
const topNavController = require("../../Controller/adminController/topNavbarController");
const router = express.Router();

router.post(
  "/topnav",
  topNavController.userRegisterValidationRules(),
  topNavController.topNavControl
);

router.get("/gettopnav", topNavController.getTopNav);
router.put("/topnav/:id", topNavController.updateNav);
router.delete("/topnav/:id", topNavController.deleteNav);

module.exports = router;  