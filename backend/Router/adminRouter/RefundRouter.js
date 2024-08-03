const refundController = require("../../Controller/adminController/RefundController");

const { Router } = require("express");
const router = Router();

router.post(
  "/refund-request",
  refundController.uploadImage,
  refundController.resizeImage,
  refundController.uploadToCloudinary,
  refundController.requestRefund
);

router.get("/get-refund", refundController.getRefund);

module.exports = router;
