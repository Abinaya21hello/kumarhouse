const Refund = require("../../Models/adminModel/RefundModel");
const multer = require("../../Cloudniary/Upload");
const sharp = require("sharp");
const Cloudinary = require("../../Cloudniary/Cloud");

// Middleware for handling file upload
const uploadImage = multer.single("image");

// Image resizing middleware
const resizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const resizedImageBuffer = await sharp(req.file.buffer)
      .resize({ width: 300, height: 250 })
      .toFormat("jpeg")
      .jpeg({ quality: 50 })
      .toBuffer();

    req.resizedImageBuffer = resizedImageBuffer;
    next();
  } catch (err) {
    console.error("Error resizing image:", err);
    return res.status(500).json({ message: "Unable to process image" });
  }
};

// Image upload to Cloudinary middleware
const uploadToCloudinary = async (req, res, next) => {
  if (!req.resizedImageBuffer) {
    return next();
  }

  try {
    const stream = Cloudinary.uploader.upload_stream(
      { folder: "ADD_REFUNDS" },
      (error, result) => {
        if (error) {
          console.error("Error uploading image to Cloudinary:", error);
          return res.status(500).json({ message: "Unable to save image" });
        }
        req.cloudinaryResult = result;
        next();
      }
    );

    // Convert the buffer to a stream and pipe it to Cloudinary
    const bufferStream = require("stream").Readable.from(
      req.resizedImageBuffer
    );
    bufferStream.pipe(stream);
  } catch (err) {
    console.error("Error uploading image to Cloudinary:", err);
    return res.status(500).json({ message: "Unable to save image" });
  }
};

const requestRefund = async (req, res) => {
  const { orderId, userId, reason, description } = req.body;
  let image = null;

  if (req.cloudinaryResult) {
    image = req.cloudinaryResult.secure_url;
  }

  try {
    // Create a new refund request
    const newRefund = new Refund({
      orderId,
      userId,
      reason,
      description,
      image,
    });

    // Save the refund request to the database
    await newRefund.save();

    // Optionally, you can update the order status here if needed

    res.status(201).json({ message: "Refund request submitted successfully." });
  } catch (err) {
    console.error("Error submitting refund request:", err);
    res.status(500).json({ error: "Failed to submit refund request." });
  }
};

//get refunds
const getRefund = async (req, res) => {
  try {
    const refund = await Refund.find();
    res.status(200).json(refund);
  } catch (err) {
    console.error("Error getting refund:", err);
    res.status(500).json({ error: "Failed to get refund." });
  }
};

const updateRefundAndOrderStatus = async (req, res) => {
  const { refundId } = req.params;
  const { status } = req.body;
  try {
    const refund = await Refund.findByIdAndUpdate(
      refundId,
      {
        status: status,
      },
      { new: true }
    );
    // const order = await Order.findById(refund.orderId);
    // order.status = status;
    await refund.save();
    res.status(200).json(refund);
  } catch (err) {
    console.error("Error updating refund and order status:", err);
    res
      .status(500)
      .json({ error: "Failed to update refund and order status." });
  }
};

module.exports = {
  uploadImage,
  resizeImage,
  uploadToCloudinary,
  requestRefund,
  getRefund,
};
