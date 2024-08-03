const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const orderController = require("../../Controller/OrdersController/OrderInfo");
const { auth } = require("../../Middleware/authMiddleware");

// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid ObjectId" });
  }
  next();
};

router.get("/get-all-orders", auth, orderController.getAllOrders);

router.get("/get-order-by-id/:order_id", auth, orderController.getSingleOrder);
router.get("/get-user-order/:userId", auth, orderController.getUserOrder);

router.put("/update-order/:orderId", auth, orderController.UpdateOrderStatus);

router.put("/orders/:orderId/cancel", orderController.cancelOrder);

module.exports = router;
