import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Typography, CircularProgress, Button, Rating } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import axiosInstance from "../../api/axiosInstance";
import { MyContext } from "../../App";
import Confetti from "js-confetti";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/actions/cartActions";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlistActions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

const SubProductDetails = () => {
  const { productId, modelId, subProductId } = useParams();
  const context = useContext(MyContext);
  const dispatch = useDispatch();
  const [subProduct, setSubProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdded, setIsAdded] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const confettiRef = useRef(null);
  const userId = localStorage.getItem("userId");

  if (!confettiRef.current) {
    confettiRef.current = new Confetti();
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

  useEffect(() => {
    const fetchSubProduct = async () => {
      try {
        const response = await axiosInstance.get(
          `api/sub-product/${productId}/models/${modelId}/sub/${subProductId}`
        );
        setSubProduct(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching sub-product");
      } finally {
        setLoading(false);
      }
    };

    fetchSubProduct();
  }, [productId, modelId, subProductId]);

  useEffect(() => {
    setIsInWishlist(wishlistItems.some((item) => item._id === subProductId));
  }, [wishlistItems, subProductId]);

  const handleAddToCart = async () => {
    loginCheck();
    try {
      const successMessage = await dispatch(
        addToCart(
          userId,
          productId,
          modelId,
          subProductId,
          subProduct.grams,
          1,
          subProduct.offerPrice
        )
      );
      setIsAdded(true);
      // confettiRef.current.addConfetti();
      alert(successMessage, { onClose: () => setIsAdded(false) });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.info("Your product is already in the cart.");
      } else {
        alert(error.message);
        console.error("Add to cart error:", error);
      }
    }
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    loginCheck();
    try {
      if (isInWishlist) {
        dispatch(removeFromWishlist(subProductId));
        alert("Product removed from wishlist.");
      } else {
        dispatch(addToWishlist(userId, productId, modelId, subProductId, 1));
        alert("Your product was added to the wishlist successfully!");
      }
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      alert("Error toggling product in wishlist.");
      console.error("Wishlist error: ", error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="body1">{error}</Typography>;
  }

  return (
    <>
      {context.windowWidth < 992 && (
        <Button
          className={`btn-g btn-lg w-100 filterBtn ${isAdded && "no-click"}`}
          onClick={handleAddToCart}
        >
          <ShoppingCartOutlinedIcon />
          {isAdded ? "Added" : "Add To Cart"}
        </Button>
      )}

      <section className="detailsPage mb-5">
        {context.windowWidth > 992 && (
          <div className="breadcrumbWrapper mb-4">
            <div className="container-fluid">
              <ul className="breadcrumb breadcrumb2 mb-0">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>{subProduct.subproductname}</li>
              </ul>
            </div>
          </div>
        )}

        <div className="container detailsContainer pt-3 pb-3">
          <div className="row">
            <div className="col-md-5 d-flex justify-content-center align-items-center">
              <div className="single-product-img">
                <img
                  src={
                    subProduct.image
                      ? `${subProduct.image}`
                      : "assets/img/products/product-img-5.jpg"
                  }
                  alt="Product"
                  className="img"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>

            <div className="col-md-7 productInfo">
              <h1>{subProduct.subproductname}</h1>
              <div className="d-flex align-items-center mb-4 mt-3">
                <Rating
                  name="half-rating-read"
                  value={parseFloat(subProduct.ratings)}
                  precision={0.5}
                  readOnly
                />
                <span className="text-light ml-2">(32 reviews)</span>
              </div>

              <div className="priceSec d-flex align-items-center mb-3">
                <span className="text-g priceLarge">
                  Rs {subProduct.offerPrice}
                </span>
                <div className="ml-3 d-flex flex-column">
                  <span className="text-org">
                    {
                      (
                        ((subProduct.currentPrice - subProduct.offerPrice) /
                          subProduct.currentPrice) *
                        100
                      ).toFixed(2)
                    }
                    % Off
                  </span>

                  <span className="text-light oldPrice">
                    Rs {subProduct.currentPrice}
                  </span>
                </div>
              </div>
              <span className="text-dark"> {subProduct.grams}g</span>

              <p
                style={{
                  fontFamily: "monospace",
                  fontWeight: "600",
                  fontSize: "26px",
                }}
              >
                {subProduct.briefDescription}
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
                    subProduct.Stock < 5 ? "stock-low" : "stock-available"
                  }
                >
                  {subProduct.Stock} Products
                </span>
              </p>

              <div className="d-flex align-items-center">
                <div className="d-flex align-items-center">
                  {context.windowWidth > 992 && (
                    <Button
                      className={`btn-g btn-lg addtocartbtn ${
                        isAdded && "no-click"
                      }`}
                      onClick={handleAddToCart}
                    >
                      <ShoppingCartOutlinedIcon />
                      {isAdded ? "Added" : "Add To Cart"}
                    </Button>
                  )}
                  <Button
                    className="btn-lg addtocartbtn ml-3 wishlist btn-border"
                    onClick={handleToggleWishlist}
                  >
                    {isInWishlist ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteBorderOutlinedIcon />
                    )}
                  </Button>
                  {/* <Button className="btn-lg addtocartbtn ml-3 btn-border">
                    <CompareArrowsIcon />
                  </Button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
};

export default SubProductDetails;
