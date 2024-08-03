const Payment = require('../Models/paymentSchema');

const createPayment = async (req, res) => {
  try {
    const { orderId, amount, method } = req.body;
    const userId = req.user._id;

    const payment = new Payment({
      user: userId,
      order: orderId,
      amount,
      method,   
      status: 'Pending'
    });

    await payment.save();

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const { status } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = status;
    await payment.save();

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPayment, updatePaymentStatus };
