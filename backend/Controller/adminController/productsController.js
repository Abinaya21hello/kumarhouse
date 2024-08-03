const express = require("express");
const router = express.Router();
const productsController = require("../../Controller/adminController/productsController");
const multer = require("../../Cloudniary/Upload"); // Adjust the path as per your project structure

// const Product = require("../../models/adminModel/productModel");

const Product = require("../../Models/adminModel/productModel");

const sharp = require("sharp");
const Cloudinary = require("../../Cloudniary/Cloud");
// Middleware for handling file upload
const uploadImage = multer.single("file");

// Image resizing middleware
const resizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const resizedImage = await sharp(req.file.buffer)
      .resize(300, 250)
      .toFormat("jpeg")
      .jpeg({ quality: 50 })
      .toBuffer();
    req.image = resizedImage.toString("base64");
    next();
  } catch (err) {
    console.error("Error resizing image:", err);
    return res.status(500).json({ message: "Unable to process image" });
  }
};

// Image upload to Cloudinary middleware
const addCardImageToCloud = async (req, res, next) => {
  if (!req.image) {
    return next();
  }
  try {
    const result = await Cloudinary.uploader.upload(
      `data:image/jpeg;base64,${req.image}`,
      { folder: "ADD PRODUCTS" }
    );
    req.result = result;
    next();
  } catch (err) {
    console.error("Error uploading image to Cloudinary:", err);
    return res.status(500).json({ message: "Unable to save image" });
  }
};

const addProducts = async (req, res) => {
  try {
    const { category, models } = req.body;
    const imageFileUrl = req.result ? req.result.secure_url : null;

    // Example validation (you should add more as per your requirements)
    if (!category || !models || !imageFileUrl) {
      console.log("Validation failed:", { category, models, imageFileUrl });
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!req.result) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Parse models JSON string to array
    let parsedModels;
    try {
      parsedModels = JSON.parse(models);
    } catch (err) {
      console.error("Error parsing models JSON:", err);
      return res.status(400).json({ message: "Invalid models format" });
    }

    // Check if a product with the same category already exists
    let existingProduct = await Product.findOne({ category });

    if (existingProduct) {
      // Product with the same category found
      let msg = "";

      parsedModels.forEach((newModel) => {
        // Check if model.main already exists in the existing product
        let existingModel = existingProduct.models.find(
          (model) => model.mainProduct === newModel.mainProduct
        );

        if (existingModel) {
          // Model with the same main name found
          let modelMsg = "";

          newModel.subProduct.forEach((newSub) => {
            // Check if sub.name already exists in the existing model
            let existingSub = existingModel.subProduct.find(
              (sub) => sub.subproductname === newSub.subproductname
            );

            if (existingSub) {
              // Sub-name exists, do nothing
              modelMsg += `Sub-name '${newSub.subproductname}' already exists in model '${newModel.mainProduct}'. `;
            } else {
              // Sub-name doesn't exist, add new sub object with image
              newSub.image = imageFileUrl;
              existingModel.subProduct.push(newSub);
              modelMsg += `New sub '${newSub.subproductname}' added to model '${newModel.mainProduct}'. `;
            }
          });

          msg += ` Model ${newModel.mainProduct}': ${modelMsg}`;
        } else {
          // Model with the same main name doesn't exist, add new model object with images
          newModel.subProduct = newModel.subProduct.map((variant) => {
            variant.image = imageFileUrl;
            return variant;
          });
          existingProduct.models.push(newModel);
          msg += `New model '${newModel.mainProduct}' added. `;
        }
      });

      // Save updated product to the database
      await existingProduct.save();
      res.status(200).json({
        message: ` Updated existing product ${category}. ${msg}`,
        product: existingProduct,
      });
    } else {
      // No product found with the same category, create new product
      const modelsWithImages = parsedModels.map((model) => ({
        mainProduct: model.mainProduct,
        subProduct: model.subProduct.map((variant) => ({
          subproductname: variant.subproductname,
          shortdescription: variant.shortdescription,
          briefDescription: variant.briefDescription,
          currentPrice: variant.currentPrice,
          offerPrice: variant.offerPrice,
          grams: variant.grams,
          Stock: variant.Stock,
          TopSelling: variant.TopSelling,
          ratings: variant.ratings,
          image: imageFileUrl,
        })),
      }));

      const newProduct = new Product({ category, models: modelsWithImages });
      await newProduct.save();
      res.status(201).json({
        message: ` New product '${category}' added.`,
        product: newProduct,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

//get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    console.log(products);
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// getById products  --single products
const getByCategory = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// to update a category
const categoriesUpdate = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { category } = req.body;

    const updatedCategory = await Product.findByIdAndUpdate(
      categoryId,
      { category },
      { new: true } // Return the updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category updated", updatedCategory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

//delete category products
const deleteProduct = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const deletedCategory = await Product.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted", deletedCategory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

//  to get a model by product ID and model ID
const getModelProduct = async (req, res) => {
  try {
    const { productId, modelId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const foundModel = product.models.id(modelId);

    if (!foundModel) {
      return res.status(404).json({ message: "Model not found" });
    }

    res.status(200).json(foundModel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

//to update a model by product ID and model ID
const updateModelProduct = async (req, res) => {
  try {
    const { productId, modelId } = req.params;
    const { mainProduct } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const foundModel = product.models.id(modelId);
    if (!foundModel) {
      return res.status(404).json({ message: "Model not found" });
    }

    if (mainProduct) foundModel.mainProduct = mainProduct;
    // if (subProduct) foundModel.subProduct.subProduct = subProduct;

    await product.save();
    res.status(200).json({ message: "Model updated", model: foundModel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

//to delete a model
const deleteModelProduct = async (req, res) => {
  try {
    const { productId, modelId } = req.params;

    // Find the product by productId
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the index of the model in the models array
    const modelIndex = product.models.findIndex(
      (model) => model._id.toString() === modelId
    );

    if (modelIndex === -1) {
      return res.status(404).json({ message: "Model not found" });
    }

    // Remove the model from the array
    product.models.splice(modelIndex, 1);

    // Save the updated product
    await product.save();

    res.status(200).json({ message: "Model deleted", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// to get a sub-model by product ID, model ID, and sub-model ID
const getModelSubProduct = async (req, res) => {
  try {
    const { productId, modelId, subProductId } = req.params;

    // Find the product by ID
    const product = await Product.findById(productId);

    // If the product is not found, return a 404 error
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Log the entire product object to see its structure
    console.log("Product:", JSON.stringify(product, null, 2));

    // Find the model by ID within the product
    const foundModel = product.models.id(modelId);
    if (!foundModel) {
      return res.status(404).json({ message: "Model not found" });
    }

    // Ensure subProduct is an array
    if (!Array.isArray(foundModel.subProduct)) {
      return res
        .status(400)
        .json({ message: "Sub-products are not properly structured" });
    }

    // Log the subProduct array
    console.log("Sub-products:", foundModel.subProduct);

    // Find the sub-product by ID within the model
    const foundSubModel = foundModel.subProduct.id(subProductId);
    if (!foundSubModel) {
      return res.status(404).json({ message: "Sub-model not found" });
    }

    // Log the found sub-model
    console.log("Found sub-model:", foundSubModel);

    // Return the found sub-model
    res.status(200).json(foundSubModel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

//to update a sub-model by product ID, model ID, and sub-model ID
const updateModelSubProduct = async (req, res) => {
  try {
    const { productId, modelId, subProductId } = req.params;
    const {
      subproductname,
      shortdescription,
      briefDescription,
      currentPrice,
      offerPrice,
      grams,
      Stock,
      TopSelling,
      ratings,
      quantity,
    } = req.body;

    // Check if req.result exists and set imageFileUrl accordingly
    const imageFileUrl = req.result ? req.result.secure_url : null;

    // Convert quantity to a number if provided
    const quantityNumber =
      quantity !== undefined ? Number(quantity) : undefined;

    if (quantityNumber !== undefined && isNaN(quantityNumber)) {
      return res.status(400).json({ message: "Invalid quantity value" });
    }

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the model by ID within the product
    const foundModel = product.models.id(modelId);
    if (!foundModel) {
      return res.status(404).json({ message: "Model not found" });
    }

    // Find the sub-product by ID within the model
    const foundSubModel = foundModel.subProduct.id(subProductId);
    if (!foundSubModel) {
      return res.status(404).json({ message: "Sub-model not found" });
    }

    // Convert Stock to a number if provided
    let stockNumber = foundSubModel.Stock;
    if (Stock !== undefined) {
      stockNumber = Number(Stock);
      if (isNaN(stockNumber)) {
        return res.status(400).json({ message: "Invalid stock value" });
      }
    }

    // Adjust stock based on quantity if provided
    if (quantityNumber !== undefined) {
      stockNumber -= quantityNumber;
      if (stockNumber < 0) {
        return res.status(400).json({ message: "Stock cannot be negative" });
      }
    }

    // Update fields if they are provided in the request body
    if (subproductname !== undefined)
      foundSubModel.subproductname = subproductname;
    if (shortdescription !== undefined)
      foundSubModel.shortdescription = shortdescription;
    if (briefDescription !== undefined)
      foundSubModel.briefDescription = briefDescription;
    if (currentPrice !== undefined) foundSubModel.currentPrice = currentPrice;
    if (offerPrice !== undefined) foundSubModel.offerPrice = offerPrice;
    if (grams !== undefined) foundSubModel.grams = grams;
    if (stockNumber !== undefined) foundSubModel.Stock = stockNumber;
    if (TopSelling !== undefined) foundSubModel.TopSelling = TopSelling;
    if (ratings !== undefined) foundSubModel.ratings = ratings;

    // Preserve the old image if a new one is not provided
    if (imageFileUrl !== null) {
      foundSubModel.image = imageFileUrl;
    } else if (!foundSubModel.image) {
      foundSubModel.image = foundSubModel.image; // Optionally set a default image URL if necessary
    }

    // Save the updated product document
    await product.save();

    // Return a success response
    res
      .status(200)
      .json({ message: "Sub-model updated", subModel: foundSubModel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
//update stock only
const updateModelStock = async (req, res) => {
  try {
    const { productId, modelId, subProductId } = req.params;
    const { quantity } = req.body;
    // console.log(quantity);
    // Convert quantity to a number if provided
    const quantityNumber =
      quantity !== undefined ? Number(quantity) : undefined;

    if (quantityNumber !== undefined) {
      if (isNaN(quantityNumber)) {
        return res.status(400).json({ message: "Invalid quantity value" });
      }
      if (quantityNumber <= 0) {
        return res
          .status(400)
          .json({ message: "Quantity must be a positive number" });
      }
    }
    // console.log(quantityNumber);
    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the model by ID within the product
    const foundModel = product.models.id(modelId);
    if (!foundModel) {
      return res.status(404).json({ message: "Model not found" });
    }

    // Find the sub-product by ID within the model
    const foundSubModel = foundModel.subProduct.id(subProductId);
    if (!foundSubModel) {
      return res.status(404).json({ message: "Sub-model not found" });
    }

    // Convert Stock to a number if needed
    let stockNumber = foundSubModel.Stock;
    // console.log(stockNumber);

    // Adjust stock based on quantity if provided
    if (quantityNumber !== undefined) {
      stockNumber -= quantityNumber;
      if (stockNumber < 0) {
        return res.status(400).json({ message: "Stock cannot be negative" });
      }
    }

    // Update the stock field only
    if (quantity !== undefined) foundSubModel.Stock = stockNumber;

    // Save the updated product document
    await product.save();

    // Return a success response
    res.status(200).json({ message: "Stock updated", subModel: foundSubModel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

//  to remove a sub-model from a product model
const deleteModelSubProduct = async (req, res) => {
  try {
    const { productId, modelId, subProductId } = req.params;

    // Find the product by productId
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the model by modelId within the product
    const foundModel = product.models.id(modelId);
    if (!foundModel) {
      return res.status(404).json({ message: "Model not found" });
    }

    // Find the sub-model by subId within the foundModel
    const foundSubModel = foundModel.subProduct.id(subProductId);
    if (!foundSubModel) {
      return res.status(404).json({ message: "Sub-model not found" });
    }

    // Remove the sub-model from the foundModel's sub array
    foundModel.subProduct.pull({ _id: subProductId }); // Use pull() to remove the subdocument
    await product.save();

    res.status(200).json({ message: "Sub-model deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

const getMainProducts = async (req, res) => {
  try {
    const products = await Product.find();
    const mainProducts = products.map((product) => ({
      category: product.category,
      mainProducts: product.models.map((model) => model.mainProduct),
    }));
    res.status(200).json(mainProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch main products" });
  }
};

//top product selling write  :
const topProductSelling = async (req, res) => {
  try {
    const topSellingProducts = await Product.aggregate([
      {
        $unwind: "$models",
      },
      {
        $unwind: "$models.subProduct",
      },
      {
        $match: {
          "models.subProduct.TopSelling": true,
        },
      },
      {
        $project: {
          productId: "$_id", // This is the product ID
          modelId: "$models._id", // This is the model ID
          subProductId: "$models.subProduct._id", // This is the sub product ID
          subproductname: "$models.subProduct.subproductname", // Example: You can include other fields you need
          shortdescription: "$models.subProduct.shortdescription",
          briefDescription: "$models.subProduct.briefDescription",
          currentPrice: "$models.subProduct.currentPrice",
          offerPrice: "$models.subProduct.offerPrice",
          grams: "$models.subProduct.grams",
          Stock: "$models.subProduct.Stock",
          TopSelling: "$models.subProduct.TopSelling",
          image: "$models.subProduct.image",
          ratings: "$models.subProduct.ratings",
        },
      },
    ]);

    res.json(topSellingProducts);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//update user ratings
const updateModelSubProductRatings = async (req, res) => {
  try {
    const { productId, modelId, subProductId } = req.params;
    const { ratings } = req.body;

    if (ratings > 5) {
      return res.status(400).send("Rating must be between 1 and 5");
    }

    // Find the product by ID
    const product = await Product.findById(productId);

    // If the product is not found, return a 404 error
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the model by ID within the product
    const foundModel = product.models.id(modelId);
    if (!foundModel) {
      return res.status(404).json({ message: "Model not found" });
    }

    // Find the sub-product by ID within the model
    const foundSubModel = foundModel.subProduct.id(subProductId);
    if (!foundSubModel) {
      return res.status(404).json({ message: "Sub-model not found" });
    }

    // Update fields if they are provided in the request body
    if (ratings) foundSubModel.ratings = ratings;

    // Save the updated product document
    await product.save();

    // Return a success response
    res
      .status(200)
      .json({ message: "Sub-model updated", subModel: foundSubModel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addProducts,
  addCardImageToCloud,
  resizeImage,
  uploadImage,
  getAllProducts,
  getByCategory,
  categoriesUpdate,
  deleteProduct,
  getModelProduct,
  updateModelProduct,
  deleteModelProduct,
  getModelSubProduct,
  updateModelSubProduct,
  deleteModelSubProduct,
  topProductSelling,
  getCategories,
  getMainProducts,
  updateModelSubProductRatings,
  updateModelStock,
};
