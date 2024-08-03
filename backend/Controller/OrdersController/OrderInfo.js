const Order = require("../../Models/paymentGetWayModel/ordersModel");

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSingleOrder = async (req, res) => {
  const { order_id } = req.params;

  try {
    const order = await Order.findOne({ order_id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
const getUserOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(`Searching for orders with user ID: ${userId}`);

    // Find orders with the given userId
    const orders = await Order.find({ userId });

    console.log("Orders found:", orders);

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ error: err.message });
  }
};

const UpdateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status, deliveryStatus } = req.body;

  try {
    const order = await Order.findOne({ order_id: orderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.status === "paid" || order.status === "success") {
      order.status = status;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      order._id,
      { $set: { status, deliveryStatus } },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ order_id: orderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.status === "paid" || order.status === "success") {
      order.status = status;
    }


    const canceledOrder = await Order.findByIdAndUpdate(
      order._id,
      { $set: { status: "cancelled" } },
      { new: true, runValidators: true }
    );

    res.status(200).json(canceledOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  UpdateOrderStatus,
  getUserOrder,
  cancelOrder,
};
