const express = require("express");
const router = express.Router();
const OrderPaymentController = require("../../Controller/paymentController/order");
const { auth } = require("../../Middleware/authMiddleware");

router.post("/create-order/", OrderPaymentController.createOrder);
router.post("/verify-payment", OrderPaymentController.verifyPayment);
router.get("/invoice/:orderId", OrderPaymentController.getInvoice);

module.exports = router;
