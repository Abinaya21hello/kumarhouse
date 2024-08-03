const CartItems = require("../../Models/productModel/cartItemsSchema");
const Product = require("../../Models/adminModel/productModel");
const multer = require("../../Cloudniary/Upload");
const sharp = require("sharp");
const Cloudinary = require("../../Cloudniary/Cloud");
const { model } = require("mongoose");
const uploadImage = multer.single("file");

// Image resizing middleware
const resizeImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
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
  try {
    const { productId, modelId, subId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const foundModel = product.models.id(modelId);
    if (!foundModel) {
      return res.status(404).json({ message: "Model not found" });
    }

    const foundSubModel = foundModel.sub.id(subId);
    if (!foundSubModel) {
      return res.status(404).json({ message: "Sub-model not found" });
    }

    res.status(200).json(foundSubModel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Add item to cart
const addCart = async (req, res) => {
  try {
    const { userId, grams, qty, total } = req.body;
    const { productId, modelId, subProductId } = req.params;
    console.log(
      "Request params and body:",
      userId,
      productId,
      modelId,
      subProductId,
      grams,
      total,
      qty
    );

    // Validate required fields
    if (
      !userId ||
      !productId ||
      !modelId ||
      !subProductId ||
      !grams ||
      !qty ||
      !total
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Product found:", JSON.stringify(product, null, 2));

    // Find the selected model within the product
    const selectedModel = product.models.id(modelId);
    if (!selectedModel) {
      return res.status(404).json({ message: "Model not found" });
    }

    console.log(
      "Selected Model found:",
      JSON.stringify(selectedModel, null, 2)
    );

    // Ensure subProduct is an array
    if (!Array.isArray(selectedModel.subProduct)) {
      return res
        .status(400)
        .json({ message: "Sub-products are not properly structured" });
    }

    // Log the subProduct array
    console.log("Sub-products:", selectedModel.subProduct);

    // Find the sub-product by ID within the model
    const foundSubModel = selectedModel.subProduct.id(subProductId);
    if (!foundSubModel) {
      return res.status(404).json({ message: "Sub-model not found" });
    }

    // Log the found sub-model
    console.log("Found sub-model:", foundSubModel);

    // Check if foundSubModel has the necessary properties
    const {
      subproductname,
      shortdescription,
      briefDescription,
      currentPrice,
      Stock,
      image,
    } = foundSubModel;

    if (!subproductname || !image) {
      return res
        .status(400)
        .json({ success: false, message: "Sub-product data is incomplete" });
    }

    console.log(
      "SubProduct details:",
      subproductname,
      shortdescription,
      briefDescription,
      currentPrice,
      Stock,
      image
    );

    if (Stock <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Product is out of stock" });
    }

    if (qty > Stock) {
      return res
        .status(400)
        .json({ success: false, message: `Available quantity is ${Stock}` });
    }

    const checkStock = Stock > 0 ? Stock : "OutOfStock";

    // Find the user's cart or create a new one if not exists
    let cart = await CartItems.findOne({ userId });
    if (!cart) {
      // Create a new cart if user doesn't have one
      cart = new CartItems({
        userId,
        cartItems: [],
      });
    }

    console.log("Cart before adding item:", cart);

    // Check if the product is already in the cart
    const itemIndex = cart.cartItems.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.subProductId.toString() === subProductId
    );

    if (itemIndex > -1) {
      return res.status(400).json({
        success: false,
        message: "Product already in cart",
        cartItems: cart.cartItems,
      });
    }

    // Add new item to cart
    cart.cartItems.push({
      productId,
      subProductId,
      modelId,
      subproductname,
      shortdescription,
      briefDescription,
      image,
      price: currentPrice,
      grams,
      quantity: qty,
      total,
      Stock: checkStock,
    });

    await cart.save();

    console.log("Cart after adding item:", cart);

    res
      .status(201)
      .json({ success: true, message: "Product added to cart successfully" });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//get cartItem user
const getCartProduct = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await CartItems.findOne({ userId }); // Use an object with userId property
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }
    res.status(200).json({ success: true, cartItems: cart.cartItems });
  } catch (error) {
    console.error("Error getting cart products:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

//update cart item (qty, grams, total)
const updateCartProduct = async (req, res) => {
  const { qty, grams } = req.body;
  const { userId, cartId } = req.params;

  try {
    // Find the cart for the specified user
    const cart = await CartItems.findOne({ userId });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Find the specific cart item by its ID
    const cartItem = cart.cartItems.id(cartId);

    if (!cartItem) {
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found" });
    }
    // console.log(cartItem.price);
    const total = qty * cartItem.price;

    // Check if requested quantity exceeds available stock
    if (qty !== undefined && Number(qty) > cartItem.Stock) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity (${qty}) exceeds available stock (${cartItem.Stock})`,
      });
    }

    // Update only the provided fields
    if (qty !== undefined) cartItem.quantity = Number(qty);
    if (grams !== undefined) cartItem.grams = grams;
    if (total !== undefined) cartItem.total = total;

    // Save the updated cart
    await cart.save();

    res
      .status(200)
      .json({ success: true, message: "Cart item updated successfully" });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

//delete user cartItemById
const deleteCartProduct = async (req, res) => {
  const { userId, cartId } = req.params;
  try {
    // Find the cart for the specified user
    const cart = await CartItems.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }
    // Find the index of the specific cart item by its ID
    const cartItemIndex = cart.cartItems.findIndex(
      (item) => item._id == cartId
    );
    if (cartItemIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found" });
    }
    // Remove the cart item from the array
    cart.cartItems.splice(cartItemIndex, 1);
    // Save the updated cart
    await cart.save();
    res
      .status(200)
      .json({ success: true, message: "Cart item deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

//delete user all cartItems
const deleteCart = async (req, res) => {
  const { userId } = req.params;
  try {
    // Find the cart for the specified user
    const cart = await CartItems.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }
    // Remove all cart items from the array
    cart.cartItems = [];
    // Save the updated cart
    await cart.save();
    res
      .status(200)
      .json({ success: true, message: "Cart deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};



module.exports = {
  resizeImage,
  addCardImageToCloud,
  uploadImage,
  addCart,
  getCartProduct,
  updateCartProduct,
  deleteCartProduct,
  deleteCart,
};
