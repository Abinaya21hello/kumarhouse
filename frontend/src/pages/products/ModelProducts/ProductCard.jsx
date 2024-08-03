import React, { useState, useRef, useCallback } from "react";
import { Button, Tooltip, Rating } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CompareArrowsOutlinedIcon from "@mui/icons-material/CompareArrowsOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import Confetti from "js-confetti";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../components/product/style.css";

const ProductCard = ({
  productData,
  addToCart,
  addToWishlist,
  removeFromWishlist,
}) => {
  const [isAdded, setIsAdded] = useState(false);
  const confettiRef = useRef(null);
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!confettiRef.current) {
    confettiRef.current = new Confetti();
  }

  if (!productData || !productData.subProductId) {
    return null;
  }

  const loginCheck = useCallback(() => {
    if (!userId) {
      alert("Please Login to add to wishlist");
      navigate("/signIn");
      return false;
    }
    return true;
  }, [userId, navigate]);

  const handleAddToCart = useCallback(async () => {
    if (!loginCheck()) return;

    try {
      const successMessage = await dispatch(
        addToCart(
          userId,
          productData.productId,
          productData.modelId,
          productData.subProductId,
          productData.grams,
          1,
          productData.offerPrice
        )
      );
      setIsAdded(true);
      alert(successMessage, { onClose: () => setIsAdded(false) });
    } catch (error) {
      alert(error.message);
    }
  }, [dispatch, addToCart, productData, userId, loginCheck]);

  const handleAddToWishlist = useCallback(
    (e) => {
      if (!loginCheck()) return;
      e.preventDefault();
      addToWishlist(productData);
    },
    [addToWishlist, productData, loginCheck]
  );

  const handleRemoveFromWishlist = useCallback(
    (e) => {
      if (loginCheck()) return;
      e.preventDefault();
      removeFromWishlist(productData.subProductId);
    },
    [removeFromWishlist, productData, loginCheck]
  );

  return (
    <div className="productThumb">
      <Link
        to={`/product/${productData.productId}/${productData.modelId}/${productData.subProductId}`}
      >
        <div className="imgWrapper">
          <img
            src={`${productData.image}?im=Resize=(320,420)`}
            className="w-100"
            alt={productData.subproductname || ""}
          />
          <div className="overlay transition">
            <ul className="list list-inline mb-0">
              <li className="list-inline-item">
                <Tooltip
                  title={
                    productData.isInWishlist
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"
                  }
                >
                  <a
                    className="cursor"
                    onClick={
                      productData.isInWishlist
                        ? handleRemoveFromWishlist
                        : handleAddToWishlist
                    }
                  >
                    {productData.isInWishlist ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteBorderOutlinedIcon />
                    )}
                  </a>
                </Tooltip>
              </li>
              <li className="list-inline-item">
                <Tooltip title="Quick View">
                  <Link
                    to={`/product/${productData.productId}/${productData.modelId}/${productData.subProductId}`}
                    className="cursor"
                  >
                    <RemoveRedEyeOutlinedIcon />
                  </Link>
                </Tooltip>
              </li>
            </ul>
          </div>
        </div>
      </Link>

      <div className="info">
        <span className="d-block catName">{productData.mainProduct}</span>
        <h4 className="title">
          <Link
            to={`/product/${productData.productId}/${productData.modelId}/${productData.subProductId}`}
          >
            {productData.subproductname
              ? productData.subproductname.substr(0, 50) + "..."
              : ""}
          </Link>
        </h4>
        <div className="d-flex align-items-center justify-content-between">
          <Rating
            name="half-rating-read"
            value={parseFloat(productData.ratings)}
            precision={0.5}
            readOnly
          />
          <div className="icons">
            <Tooltip
              title={
                productData.isInWishlist
                  ? "Remove from Wishlist"
                  : "Add to Wishlist"
              }
            >
              <a
                className="cursor"
                onClick={
                  productData.isInWishlist
                    ? handleRemoveFromWishlist
                    : handleAddToWishlist
                }
              >
                {productData.isInWishlist ? (
                  <FavoriteIcon />
                ) : (
                  <FavoriteBorderOutlinedIcon />
                )}
              </a>
            </Tooltip>
            <Tooltip title="Compare">
              <a className="cursor">
                <CompareArrowsOutlinedIcon />
              </a>
            </Tooltip>
            <Tooltip title="Quick View">
              <Link
                to={`/product/${productData.productId}/${productData.modelId}/${productData.subProductId}`}
                className="cursor"
              >
                <RemoveRedEyeOutlinedIcon />
              </Link>
            </Tooltip>
          </div>
        </div>
        <div className="d-flex align-items-center mt-3">
          <div className="d-flex align-items-center w-100">
            <span className="price text-g font-weight-bold">
              Rs {productData.offerPrice}
            </span>
            <span className="oldPrice ml-auto">
              Rs {productData.currentPrice}
            </span>
          </div>
        </div>
        <Button className="w-100 transition mt-3" onClick={handleAddToCart}>
          <ShoppingCartOutlinedIcon />
          {isAdded ? "Added" : "Add"}
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProductCard;
