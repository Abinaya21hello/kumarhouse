const Razorpay = require("razorpay");
const crypto = require("crypto");
const { razorpay_key_id, razorpay_key_secret } = require("../../Config/Config");

const cartItems = require("../../Models/productModel/cartItemsSchema");

const Order = require("../../Models/paymentGetWayModel/ordersModel");
const multer = require("../../Cloudniary/Upload");
const sharp = require("sharp");
const Cloudinary = require("../../Cloudniary/Cloud");
const productModel= require("../../Models/adminModel/productModel");

//pdf for invoice
const generateInvoicePDF = require("../../Config/pdfGeneratorForInvoice");

const uploadImage = multer.single("file");

const razorpay = new Razorpay({
  key_id: razorpay_key_id,
  key_secret: razorpay_key_secret,
});

const resizeImage = async (req, res, next) => {
  if (!req.file) {
    return next(); // Proceed if no file uploaded
  }
  try {
    const resizedImage = await sharp(req.file.buffer)
      .resize(1450, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 50 })
      .toBuffer();
    req.image = resizedImage.toString("base64");
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error resizing image" });
  }
};

const addOrderImageToCloud = async (req, res, next) => {
  if (!req.image) {
    return next();
  }
  try {
    const result = await Cloudinary.uploader.upload(
      `data:image/jpeg;base64,${req.image}`,
      { folder: "To Add Offers" }
    );
    req.result = result;
    next();
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Error uploading image to Cloudinary" });
  }
};

// Order creation
const createOrder = async (req, res) => {
  const {
    userId,
    users,
    products,
    totalAmount,
    currency,
    deliveryAddress,
    method,
    transactionId
  } = req.body; 

  console.log("Received order data:", {
    userId,
    users,
    products,
    totalAmount,
    currency,
    deliveryAddress,
    method,
    transactionId 
  });

  if (method === "razorpay") {
    const options = {
      amount: parseInt(totalAmount, 10) * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
      payment_capture: 1,
    };

    try {
      const order = await razorpay.orders.create(options);

      const newOrder = new Order({
        userId,
        users,
        products: products.map((product) => ({
          productId: product.productId,
          modelId: product.modelId,
          subProductId: product.subProductId,
          ProductImage: product.ProductImage,
          ProductName: product.ProductName,
          grams: product.grams,
          currentPrice: product.currentPrice,
          quantity: product.quantity,
        })),
        order_id: order.id,
        totalAmount: totalAmount,
        currency: order.currency,
        receipt: order.receipt,
        status: "created",
        deliveryAddress,
        method,
        deliveryStatus: "not received",
      });
      await newOrder.save();
      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).send("Something went wrong while creating the order");
    }
  } else if (method === "cod") {
    try {
      const order_id = crypto.randomBytes(10).toString("hex");
      const receipt = crypto.randomBytes(10).toString("hex");

      const newOrder = new Order({
        userId,
        users,
        products: products.map((product) => ({
          productId: product.productId,
          modelId: product.modelId,
          subProductId: product.subProductId,
          ProductImage: product.ProductImage,
          ProductName: product.ProductName,
          grams: product.grams,
          currentPrice: product.currentPrice,
          quantity: product.quantity,
        })),
        order_id: order_id,
        totalAmount: totalAmount,
        currency: currency,
        receipt: receipt,
        status: "pending",
        deliveryAddress,
        method,
        deliveryStatus: "not received",
      });
      await newOrder.save();
      res.json({
        message: "Order placed successfully with COD",
        order: newOrder,
      });
    } catch (error) {
      console.error("Error creating COD order:", error);
      res.status(500).send("Something went wrong while creating the order");
    }
  } else if (method === "gpay") {
    try {
      const order_id = crypto.randomBytes(10).toString("hex"); // Generate a unique order ID
      const receipt = crypto.randomBytes(10).toString("hex");

      // Save the order with GPay transaction ID
      const newOrder = new Order({
        userId,
        users,
        products: products.map((product) => ({
          productId: product.productId,
          modelId: product.modelId,
          subProductId: product.subProductId,
          ProductImage: product.ProductImage,
          ProductName: product.ProductName,
          grams: product.grams,
          currentPrice: product.currentPrice,
          quantity: product.quantity,
        })),
        order_id: transactionId,
        totalAmount: totalAmount,
        currency: currency,
        receipt: receipt,
        status: "pending", 
        deliveryAddress,
        method,
        deliveryStatus: "not received",
      });
      await newOrder.save();
      res.json({
        message: "Order placed successfully with GPay",
        order: newOrder,
      });
    } catch (error) {
      console.error("Error creating GPay order:", error);
      res.status(500).send("Something went wrong while creating the GPay order");
    }
  } else {
    res.status(400).send("Invalid payment method");
  }
};


// Order verification
const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const hmac = crypto.createHmac("sha256", razorpay_key_secret);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const generated_signature = hmac.digest("hex");

  if (generated_signature === razorpay_signature) {
    try {
      const updatedOrder = await Order.findOneAndUpdate(
        { order_id: razorpay_order_id },
        {
          payment_id: razorpay_payment_id,
          signature: razorpay_signature,
          status: "paid",
        },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json({ status: "success" });
    } catch (error) {
      console.error("Error updating order:", error);
      res
        .status(500)
        .json({ error: "Server error while updating order status" });
    }
  } else {
    try {
      await Order.findOneAndUpdate(
        { order_id: razorpay_order_id },
        { status: "failed" }
      );
    } catch (error) {
      console.error("Error updating order status to failed:", error);
    }
    res.status(400).json({ status: "failure" });
  }
};

//get invoice

const getInvoice = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    // Fetch order details from MongoDB
    const order = await Order.findOne({ order_id: orderId });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Generate invoice PDF
    const pdfData = await generateInvoicePDF(order);

    // Validate pdfData
    if (!pdfData || pdfData.length === 0) {
      return res.status(500).json({ error: "Empty PDF data received" });
    }

    // Send the invoice file for download
    res.contentType("application/pdf");
    res.send(pdfData);
  } catch (error) {
    console.error("Error fetching or generating invoice:", error);
    res
      .status(500)
      .json({ error: "Server error while fetching or generating invoice" });
  }
};

module.exports = { createOrder, verifyPayment, getInvoice };
