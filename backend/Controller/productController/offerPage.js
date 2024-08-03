const offerPage = require("../../Models/productModel/productOffers");
const multer = require("../../Cloudniary/Upload");
const sharp = require("sharp");
const Cloudinary = require("../../Cloudniary/Cloud");
const { model } = require("mongoose");

const uploadImage = multer.single("file");

const getOffer = async (req, res) => {
  try {
    const events = await offerPage.find();
    if (!events) {
      return res.status(404).json({ message: "Cannot find offers" });
    }
    return res.status(200).json(events);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

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

const addOfferImageToCloud = async (req, res, next) => {
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

const addOffer = async (req, res) => {
  const { title, offerPercentage, expireDate } = req.body;
  if (Number(offerPercentage) > 100) {
    return res
      .status(400)
      .json({ message: "Offer percentage must be less than 100" });
  }

  if (!req.result) {
    return res.status(400).json({ message: "Image is required" });
  }
  try {
    const newOffer = new offerPage({
      title,
      offerPercentage,
      expireDate,
      image: req.result ? req.result.secure_url : null,
    });

    await newOffer.save();
    return res.status(200).json(newOffer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateOffer = async (req, res) => {
  const id = req.params.id;
  const { title, offerPercentage, expireDate } = req.body;
  if (Number(offerPercentage) > 100) {
    return res
      .status(400)
      .json({ message: "Offer percentage must be less than 100" });
  }
  try {
    const existingOffer = await offerPage.findById(id);
    if (!existingOffer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    if (title !== undefined) {
      existingOffer.title = title;
    }
    if (offerPercentage !== undefined) {
      existingOffer.offerPercentage = offerPercentage;
    }
    if (expireDate !== undefined) {
      existingOffer.expireDate = expireDate;
    }
    if (req.result && req.result.secure_url) {
      existingOffer.image = req.result.secure_url;
    }

    await existingOffer.save();
    return res
      .status(200)
      .json({ message: "Updated successfully", existingOffer });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteOffer = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedOffer = await offerPage.findByIdAndDelete(id);
    if (!deletedOffer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    return res.status(200).json({ message: "Offer deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getOffer,
  uploadImage,
  resizeImage,
  addOfferImageToCloud,
  deleteOffer,
  addOffer,
  updateOffer,
};
