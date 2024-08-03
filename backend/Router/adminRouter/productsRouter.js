const express = require("express");
const router = express.Router();
const productsController = require("../../Controller/adminController/productsController");
const multer = require("../../Cloudniary/Upload"); // Adjust the path as per your project structure

// Middleware for handling file upload
const uploadImage = multer.single("file");

// POST endpoint for adding a new product
router.post(
  "/products",
  productsController.uploadImage,
  productsController.resizeImage,
  productsController.addCardImageToCloud,
  productsController.addProducts
);
router.get("/categories", productsController.getCategories);
router.get("/main-products", productsController.getMainProducts);
// to get All producta
router.get("/getProducts", productsController.getAllProducts);

// to getById product category
router.get("/categories/:id", productsController.getByCategory);

//to update category
router.put("/category-update/:categoryId", productsController.categoriesUpdate);

//to update category
router.delete("/category-delete/:categoryId", productsController.deleteProduct);

//to get model id category
router.get(
  "/products/:productId/models/:modelId",
  productsController.getModelProduct
);

//to update model mainProduct
router.put(
  "/products-update/:productId/models/:modelId",
  productsController.updateModelProduct
);
router.get("/top-selling-products", productsController.topProductSelling);
//to delete model mainProducts
router.delete(
  "/products-delete/:productId/models/:modelId",
  productsController.deleteModelProduct
);

//get subProducts
router.get(
  "/sub-product/:productId/models/:modelId/sub/:subProductId",
  productsController.getModelSubProduct
);

//update sub products
router.put(
  "/sub-product-update/:productId/models/:modelId/sub/:subProductId",
  productsController.uploadImage,
  productsController.resizeImage,
  productsController.addCardImageToCloud,
  productsController.updateModelSubProduct
);

//update stock sub prodcut
router.put(
  "/sub-product-stock-update/:productId/models/:modelId/sub-stock/:subProductId", 
  productsController.updateModelStock
);

// delete sub product
router.delete(
  "/sub-product-delete/:productId/models/:modelId/sub/:subProductId",
  productsController.deleteModelSubProduct
);

//topSellingProductList
router.get("/top-selling-products", productsController.topProductSelling);

//user update ratings
router.put(
  "/sub-product-update-ratings/:productId/models/:modelId/sub/:subProductId",
  productsController.updateModelSubProductRatings
);

module.exports = router;
