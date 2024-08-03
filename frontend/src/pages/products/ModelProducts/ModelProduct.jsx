import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import { CircularProgress, Grid, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Confetti from "js-confetti";
import { addToCart } from "../../../redux/actions/cartActions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlistActions";
import ProductCard from "./ProductCard";
// import ParallaxCarousel from '../carosuel/Carosuel';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import './model.css'; // Import the CSS file
import Sidebar from "../../../components/Sidebar";
const ModelProduct = () => {
  const { productId, modelId } = useParams();
  const [modelProduct, setModelProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.wishlistItems);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  //login check
  const loginCheck = () => {
    if (!userId) {
      alert("Please Login to add to cart");
      navigate("/signIn");
      return;
    }
  };

  useEffect(() => {
    const fetchSubProduct = async () => {
      try {
        const response = await axiosInstance.get(
          `api/products/${productId}/models/${modelId}`
        );
        setModelProduct(response.data);
        console.log("Fetched modelProduct data:", response.data); // Add this line
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching sub-product");
      } finally {
        setLoading(false);
      }
    };

    fetchSubProduct();
  }, [productId, modelId]);

  const handleAddToCart = async (product) => {
    loginCheck();
    try {
      const successMessage = await dispatch(
        addToCart(
          userId,
          productId,
          modelId,
          product._id,
          product.grams,
          1,
          product.offerPrice
        )
      );
      // const confetti = new Confetti();
      // confetti.addConfetti();
      // console.log(successMessage);
      alert(successMessage);
    } catch (error) {
      // console.error("Add to cart error:", error);
      alert("Add to cart error:", error);
    }
  };

  const handleAddToWishlist = (product) => {
    loginCheck();
    try {
      dispatch(addToWishlist(userId, productId, modelId, product._id, 1));
    } catch (error) {
      console.error("Add to wishlist error:", error);
    }
  };

  const handleRemoveFromWishlist = (subProductId) => {
    try {
      dispatch(removeFromWishlist(subProductId));
    } catch (error) {
      console.error("Remove from wishlist error:", error);
    }
  };

  const isInWishlist = (subProductId) => {
    return wishlist.some((item) => item._id === subProductId);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (
    !modelProduct ||
    !modelProduct.subProduct ||
    modelProduct.subProduct.length === 0
  ) {
    console.log(
      "No sub-products found or data structure mismatch:",
      modelProduct
    ); // Add this line
    return <div>No sub-products found.</div>;
  }

  return (
    <div className="modelProductPage">
      {/* <ParallaxCarousel /> */}
      <Typography variant="h4" gutterBottom>
        Model Products
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Sidebar
            categories={[modelProduct]}
            // Include filter functions if required
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <Grid container spacing={4}>
            {modelProduct.subProduct.map((product) => (
              <Grid item key={product._id} xs={12} sm={6} md={4}>
                <ProductCard
                  productData={{
                    ...product,
                    productId: productId,
                    modelId: modelId,
                    subProductId: product._id, // Add this line
                    isInWishlist: isInWishlist(product._id),
                  }}
                  addToCart={handleAddToCart}
                  addToWishlist={handleAddToWishlist}
                  removeFromWishlist={handleRemoveFromWishlist}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <ToastContainer />
    </div>
  );
};

export default ModelProduct;
