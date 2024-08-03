import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import Sidebar from "../../components/Sidebar";
import { listProducts } from "../../redux/actions/productActions";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlistActions";

const Product = () => {
  const { categoryName } = useParams();
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product);
  const wishlist = useSelector((state) => state.wishlist);

  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    dispatch(listProducts(categoryName));
  }, [dispatch, categoryName]);

  useEffect(() => {
    setFilteredProducts(productList.products);
  }, [productList.products]);

  const handleFilterByPrice = (minValue, maxValue) => {
    const filtered = productList.products.filter((product) =>
      product.models.some((model) =>
        model.subProduct.some(
          (subProduct) =>
            subProduct.offerPrice >= minValue &&
            subProduct.offerPrice <= maxValue
        )
      )
    );
    setFilteredProducts(filtered);
  };

  const handleFilterByBrand = (brandId) => {
    const filtered = productList.products.filter(
      (product) => product._id === brandId
    );
    setFilteredProducts(filtered);
  };

  const handleFilterByMainProduct = (mainProductId) => {
    const filtered = productList.products.filter((product) =>
      product.models.some((model) => model._id === mainProductId)
    );
    setFilteredProducts(filtered);
  };

  const handleFilterByRating = (ratings) => {
    const filtered = productList.products.filter((product) =>
      product.models.some((model) =>
        model.subProduct.some(
          (subProduct) => subProduct.ratings >= parseFloat(ratings)
        )
      )
    );
    setFilteredProducts(filtered);
  };

  const getAllSubProducts = (products) => {
    const subProducts = [];
    products.forEach((product) => {
      product.models.forEach((model) => {
        model.subProduct.forEach((sub) => {
          if (sub.ratings >= 1) {
            subProducts.push({
              ...sub,
              productId: product._id,
              modelId: model._id,
              subProductId: sub._id,
              brand: product.category,
              rating: model.rating,
              model: model.mainProduct,
            });
          }
        });
      });
    });
    return subProducts;
  };

  const subProducts = getAllSubProducts(filteredProducts);

  const handleAddToWishlist = (product) => {
    dispatch(addToWishlist(product));
  };

  const handleRemoveFromWishlist = (subProductId) => {
    dispatch(removeFromWishlist(subProductId));
  };

  const isInWishlist = (subProductId) => {
    return wishlist.wishlistItems.some((item) => item._id === subProductId);
  };

  return (
    <div className="productPage">
      <div className="container-fluid bg-breadcrumbproduct">
        <div className="container text-center py-5" style={{ maxWidth: 900 }}>
          <h3
            className="text display-3 mb-4 wow fadeInDown"
            style={{ fontWeight: "600", fontSize: "7vw", color: "black" }}
            data-wow-delay="0.1s"
          >
            Our Products
          </h3>
        </div>
      </div>

      <Typography variant="h4" gutterBottom>
        Products in {categoryName}
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Sidebar
            categories={productList.products}
            filterByPrice={handleFilterByPrice}
            filterByBrand={handleFilterByBrand}
            filterByMainProduct={handleFilterByMainProduct}
            filterByRating={handleFilterByRating}
            loading={productList.loading}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <Grid container spacing={4}>
            {subProducts.map((product) => (
              <Grid item key={product.subProductId} xs={12} sm={6} md={4}>
                <ProductCard
                  productData={product}
                  addToWishlist={handleAddToWishlist}
                  removeFromWishlist={handleRemoveFromWishlist}
                  isInWishlist={isInWishlist(product.subProductId)}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Product;
