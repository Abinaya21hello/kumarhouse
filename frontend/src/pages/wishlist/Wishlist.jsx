import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { RiDeleteBinLine } from "react-icons/ri";
import Rating from "@mui/material/Rating";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { BsCartPlus } from "react-icons/bs";
import "./style.css"; // Make sure this is the correct path to your CSS file

import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/actions/cartActions";

import axiosInstance from "../../api/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Wishlist = () => {
  const [wishListItems, setWishListItems] = useState([]);
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      alert("please login");
      // alert("please login");
      navigate("/signIn");
      return;
    }
  }, [navigate]);

  const handleAddToCart = () => {
    dispatch(
      addToCart(
        userId,
        wishListItems.productId,
        wishListItems.modelId,
        wishListItems.subProductId,
        wishListItems.grams,
        1,
        wishListItems.offerPrice
      )
    );
    // const confetti = new Confetti();
    // confetti.addConfetti();
    alert("Your product was added successfully!");
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axiosInstance.get(
          `api/get-user-wishlist/${userId}`
        );
        const data = response.data;
        // console.log(response.data)
        if (data.success && Array.isArray(data.Wishlist)) {
          setWishListItems(data.Wishlist);
        } else {
          // console.error("Expected an array but received:", data);
          setWishListItems([]);
        }
      } catch (error) {
        // console.error("Error fetching wishlist items:", error);
        setWishListItems([]);
      }
    };

    fetchWishlist();
  }, [userId, wishListItems]);

  const handleRemoveFromCart = async (subProductId) => {
    // console.log(userId, subProductId);
    try {
      const response = await axiosInstance.delete(
        `api/delete-user-cartId/${userId}/wishlist/${subProductId}`
      );
      if (response.status === 200) {
        setWishListItems((prevItems) =>
          prevItems.filter((item) => item.subProductId !== subProductId)
        );
      } else {
        console.error("Failed to remove item from wishlist");
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  return (
    <div className="cartSection">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <h1>Your Wishlist</h1>
            <p>
              There are <span className="text-g">{wishListItems.length}</span>{" "}
              products in your wishlist
            </p>

            <div className="cartWrapper wishlistcartWrapper">
              <div className="table-responsive">
                <table className="table overflow-scroll">
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>Product</th>
                      <th>Unit Price</th>
                      <th>quantity</th>
                      <th>Remove</th>
                      <th>Product View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishListItems.length > 0 ? (
                      wishListItems.map((item, index) => (
                        <tr key={index}>
                          <td width="50%">
                            <div className="d-flex align-items-center">
                              <div className="img">
                                <Link
                                  to={`/product/${item.productId}/models/${item.modelId}/subproducts/${item.subProductId}`}
                                >
                                  <img
                                    src={item.image}
                                    alt={item.subproductname}
                                    className="product-image"
                                  />
                                </Link>
                              </div>
                              <div className="info pl-2">
                                <Link
                                  to={`/product/${item.productId}/models/${item.modelId}/subproducts/${item.subProductId}`}
                                >
                                  <h4 className="m-0">{item.subproductname}</h4>
                                </Link>
                                <p> Grams : {item.grams}</p>
                              </div>
                            </div>
                          </td>
                          <td width="20%">
                            <span>
                              Rs: {item.price ? parseInt(item.price) : "N/A"}
                            </span>
                          </td>

                          <td>
                            <span className="text-g">
                              {parseInt(item.quantity)}
                            </span>
                          </td>
                          <td>
                            <span
                              className="cursor ms-4"
                              onClick={() => handleRemoveFromCart(item._id)}
                            >
                              <RiDeleteBinLine />
                            </span>
                          </td>
                          {/* <td>
                            <span
                              className="cursor ms-4"
                              onClick={() => handleAddToCart(item._id)}
                            >
                              <BsCartPlus />
                            </span>
                          </td> */}
                          <td className="text-center">
                            <Link
                              to={`/product/${item.productId}/${item.modelId}/${item.subProductId}`}
                            >
                              <h4 className="m-0">view</h4>
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">No items in Wishlist.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <Link to="/product">
              <Button>
                <KeyboardBackspaceIcon /> Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Wishlist;
