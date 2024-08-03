import React, { useEffect, useState, useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Typography, CircularProgress, Button, Rating } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { listSubProducts } from "../../redux/actions/productActions";
import { addToCart } from "../../redux/actions/cartActions";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlistActions";
import { MyContext } from "../../App";
import Confetti from "js-confetti";
import "./prodetail.css"; // Assuming you have custom styles in this file
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetail = () => {
  const { productId, modelId, subProductId } = useParams();
  const dispatch = useDispatch();
  const context = useContext(MyContext);

  const [isAdded, setIsAdded] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const confettiRef = useRef(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (productId && modelId && subProductId) {
      dispatch(listSubProducts(productId, modelId, subProductId));
    } else {
      console.error("URL parameters are missing:", {
        productId,
        modelId,
        subProductId,
      });
    }
  }, [dispatch, productId, modelId, subProductId]);

  const productDetail = useSelector((state) => state.subProducts);
  const cart = useSelector((state) => state.cart);
  const wishlist = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (wishlist.wishlistItems.some((item) => item._id === subProductId)) {
      setIsInWishlist(true);
    } else {
      setIsInWishlist(false);
    }
  }, [wishlist, subProductId]);

  if (productDetail.loading) {
    return <CircularProgress />;
  }

  if (
    !productDetail.subProducts ||
    Object.keys(productDetail.subProducts).length === 0
  ) {
    return <Typography variant="body1">No products available.</Typography>;
  }

  const { subProducts } = productDetail;

  const { _id: subProductIdFromData, grams, offerPrice } = subProducts;
  const productIdFromData = productId || subProducts.productId;
  const modelIdFromData = modelId || subProducts.modelId;

  if (!productIdFromData || !modelIdFromData || !subProductIdFromData) {
    return (
      <Typography variant="body1">
        Required properties are missing. Please try again.
      </Typography>
    );
  }
  const navigate = useNavigate;

  function loginCheck() {
    if (!userId) {
      alert("please login");
      // alert("please login");
      navigate("/signIn");
      return;
    }
  }

  const handleAddToCart = async () => {
    loginCheck();
    try {
      const isAlreadyInCart = cart.cartItems.some(
        (item) => item.subProductId === subProductIdFromData
      );

      if (isAlreadyInCart) {
        alert("Your product is already in the cart.");
        return;
      }

      const response = await dispatch(
        addToCart(
          userId,
          productIdFromData,
          modelIdFromData,
          subProductIdFromData,
          grams,
          1,
          offerPrice
        )
      );
      setIsAdded(true);

      alert(response, { onClose: () => setIsAdded(false) });
    } catch (error) {
      alert(error.message);
      console.error("Add to cart error:", error);
    }
  };

  const handleAddToWishlist = async (e) => {
    loginCheck();
    e.preventDefault();
    try {
      const successMessage = await dispatch(
        addToWishlist(
          userId,
          productIdFromData,
          modelIdFromData,
          subProductIdFromData,
          1
        )
      );
      alert(successMessage, { onClose: () => setIsAdded(false) });
    } catch (error) {
      alert(error.message);
      console.error("Add to wishlist error: ", error);
    }
  };
  const handleRemoveFromWishlist = async (e) => {
    e.preventDefault();
    try {
      const successMessage = await dispatch(
        removeFromWishlist(userId, subProductIdFromData)
      );
      alert(successMessage);
    } catch (error) {
      alert(error.message);
      console.error("Remove from wishlist error: ", error);
    }
  };

  return (
    <>
      {/* {context.windowWidth < 992 && (
        <Button
          className={`btn-g btn-lg w-100 filterBtn ${isAdded && "no-click"}`}
          onClick={handleAddToCart}
        >
          <ShoppingCartOutlinedIcon />
          {isAdded ? "Added" : "Add To Cart"}
        </Button>
      )} */}

      <section className="detailsPage mb-5">
        {context.windowWidth > 992 && (
          <div className="breadcrumbWrapper mb-4">
            <div className="container-fluid">
              <ul className="breadcrumb breadcrumb2 mb-0">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>{subProducts.subproductname}</li>
              </ul>
            </div>
          </div>
        )}

        <div className="container detailsContainer pt-3 pb-3">
          <div className="row">
            {/* Product Images */}
            <div className="col-md-5 d-flex justify-content-center align-items-center">
              <div className="single-product-img">
                <img
                  src={
                    subProducts.image
                      ? ` ${subProducts.image}`
                      : "assets/img/products/product-img-5.jpg"
                  }
                  alt="Product"
                  className="img"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="col-md-7 productInfo">
              <h1>{subProducts.subproductname}</h1>
              <div className="d-flex align-items-center mb-4 mt-3">
                <Rating
                  name="half-rating-read"
                  value={parseFloat(subProducts.ratings)}
                  precision={0.5}
                  readOnly
                />
                <span className="text-light ml-2">(32 reviews)</span>
              </div>

              <div className="priceSec d-flex align-items-center mb-3">
                <span className="text-g priceLarge">
                  Rs {subProducts.offerPrice}
                </span>
                <div className="ml-3 d-flex flex-column">
                  <span className="text-org">
                    {
                      (
                        ((subProducts.currentPrice - subProducts.offerPrice) /
                          subProducts.currentPrice) *
                        100
                      ).toFixed(2)
                    }
                    % Off
                  </span>

               
                  <span className="text-light oldPrice">
                    Rs {subProducts.currentPrice}
                  </span>
                </div>
              </div>
              <span className="text-dark"> {subProducts.grams}g</span>

              <p
                style={{
                  fontFamily: "monospace",
                  fontWeight: "600",
                  fontSize: "26px",
                }}
              >
                {subProducts.briefDescription}
              </p>
              <p
                style={{
                  fontFamily: "monospace",
                  fontWeight: "600",
                  fontSize: "26px",
                }}
              >
                Stocks Availability:
                <span
                  className={
                    subProducts.Stock < 5 ? "stock-low" : "stock-available"
                  }
                >
                  {subProducts.Stock} Products
                </span>
              </p>

              <div className="d-flex align-items-center mt-4">
                <Button
                  className={`btn-g btn-lg w-100 mr-2 ${isAdded && "no-click"}`}
                  onClick={handleAddToCart}
                >
                  <ShoppingCartOutlinedIcon />
                  {isAdded ? "Added" : "Add To Cart"}
                </Button>
                <Button
                  className="btn-g btn-lg w-100"
                  onClick={
                    isInWishlist
                      ? handleRemoveFromWishlist
                      : handleAddToWishlist
                  }
                >
                  {isInWishlist ? (
                    <>
                      <FavoriteIcon /> Remove from Wishlist
                    </>
                  ) : (
                    <>
                      <FavoriteBorderOutlinedIcon /> Add to Wishlist
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
};

export default ProductDetail;
