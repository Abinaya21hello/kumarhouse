const Product = require("../../Models/adminModel/productModel"); // Adjust the path as needed
const Wishlist = require("../../Models/adminModel/wishlistSchema"); // Adjust the path as needed

const addToWishlist = async (req, res) => {
  try {
    const { userId, qty } = req.body;
    const { productId, modelId, subProductId } = req.params;

    // Validate required fields
    if (!userId || !productId || !modelId || !subProductId || !qty) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the selected model within the product
    const selectedModel = product.models.id(modelId);
    if (!selectedModel) {
      return res.status(404).json({ message: "Model not found" });
    }

    // Ensure subProduct is an array
    if (!Array.isArray(selectedModel.subProduct)) {
      return res
        .status(400)
        .json({ message: "Sub-products are not properly structured" });
    }

    // Find the sub-product by ID within the model
    const foundSubModel = selectedModel.subProduct.id(subProductId);
    if (!foundSubModel) {
      return res.status(404).json({ message: "Sub-model not found" });
    }

    const {
      subproductname,
      shortdescription,
      briefDescription,
      currentPrice,
      grams,
      Stock,
      image,
    } = foundSubModel;

    if (!subproductname || !image) {
      return res
        .status(400)
        .json({ success: false, message: "Sub-product data is incomplete" });
    }

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

    // Find the user's wishlist or create a new one if not exists
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      // Create a new wishlist if user doesn't have one
      wishlist = new Wishlist({
        userId,
        Wishlist: [], // Initialize Wishlist array
      });
    } else if (!Array.isArray(wishlist.Wishlist)) {
      // Ensure Wishlist is an array if the document exists but the field is missing
      wishlist.Wishlist = [];
    }

    // Check if the product is already in the wishlist
    const itemIndex = wishlist.Wishlist.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.subProductId.toString() === subProductId
    );

    if (itemIndex > -1) {
      // Remove the item from the wishlist
      wishlist.Wishlist.splice(itemIndex, 1);

      await wishlist.save();

      return res.status(200).json({
        success: true,
        message: "Product removed from wishlist successfully",
        Wishlist: wishlist.Wishlist,
      });
    }

    // Add new item to wishlist
    wishlist.Wishlist.push({
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
      Stock: checkStock,
    });

    await wishlist.save();

    res.status(201).json({
      success: true,
      message: "Product added to wishlist successfully",
      Wishlist: wishlist.Wishlist,
    });
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get wishlist details for a specific user
const getWishlistspecificUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await Wishlist.findOne({ userId }); // Use an object with userId property
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }
    res.status(200).json({ success: true, Wishlist: cart.Wishlist });
  } catch (error) {
    console.error("Error getting cart products:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

// // Get wishlist details
// const getWishlist = async (req, res) => {
//   const userId = req.user.id;

//   try {
//     const wishlist = await Wishlist.findOne({ userId });
//     if (!wishlist) {
//       return res.status(404).json({ message: "Wishlist not found" });
//     }
//     res.status(200).json(wishlist);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Failed to get wishlist", message: error.message });
//   }
// };

// // Remove item from wishlist
// const removeWishlistItem = async (req, res) => {
//   const userId = req.user.id;
//   const { itemId } = req.params;

//   try {
//     const wishlist = await Wishlist.findOne({ userId });
//     if (!wishlist) {
//       return res.status(404).json({ message: "Wishlist not found" });
//     }

//     wishlist.items = wishlist.items.filter(
//       (item) => item._id.toString() !== itemId
//     );
//     await wishlist.save();

//     res
//       .status(200)
//       .json({ message: "Item deleted successfully from Wishlist" });
//   } catch (error) {
//     res.status(500).json({
//       error: "Failed to remove wishlist item",
//       message: error.message,
//     });
//   }
// };

// // Clear the entire wishlist
const removeWishlistItem = async (req, res) => {
  const { userId, cartId } = req.params;
  try {
    // Find the cart for the specified user
    const cart = await Wishlist.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }
    // Find the index of the specific cart item by its ID
    const cartItemIndex = cart.Wishlist.findIndex((item) => item._id == cartId);
    if (cartItemIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found" });
    }
    // Remove the cart item from the array
    cart.Wishlist.splice(cartItemIndex, 1);
    // Save the updated cart
    await cart.save();
    res
      .status(200)
      .json({ success: true, message: "Wishlist item deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

const deleteUserAllWishListItems = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Wishlist.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }
    cart.Wishlist.splice(0, cart.Wishlist.length);
    await cart.save();
    res
      .status(200)
      .json({ success: true, message: "Wishlist item deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

// // Resize image

module.exports = {
  // getWishlist,
  getWishlistspecificUser,
  addToWishlist,
  // removeWishlistItem,
  removeWishlistItem,
  deleteUserAllWishListItems,
  // uploadImage,
  // resizeImage,
  // addImageToCloud,
  // updateWishlistItemImage,
};
