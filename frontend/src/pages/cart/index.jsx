import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Button } from "@mui/material";
import QuantityBox from "../../components/quantityBox";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { MyContext } from "../../App";

// import axios from "axios";
import axiosInstance from "../../api/axiosInstance";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const Cart = () => {
  const navigate = useNavigate();
  const context = useContext(MyContext);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    if (!userId) {
      alert("please login");
      // alert("please login");
      navigate("/signIn");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    getCart();
  }, [userId]);

  useEffect(() => {
    setSubtotal(calculateSubtotal());
  }, [cartItems]);

  const getCart = async () => {
    try {
      const response = await axiosInstance.get(
        `api/get-cart-product/${userId}`,

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data && response.data.cartItems) {
        setCartItems(response.data.cartItems);
        // console.log(response.data.cartItems);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItems([]);
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this item from the cart?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await axiosInstance.delete(
                `api/delete-cart-item/${userId}/cart/${itemId}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              setCartItems((prevItems) =>
                prevItems.filter((item) => item._id !== itemId)
              );
            } catch (error) {
              // console.error("Error removing item from cart:", error);
            }
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const handleUpdateQuantity = (items) => {
    setCartItems(items);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (acc, item) =>
        acc + (parseInt(item.price) || 0) * parseInt(item.quantity),
      0
    );
  };

  const handleCartItems = () => {
    if (cartItems.length === 0) {
      alert("your cart is empty");
      return navigate("/product");
    }
    navigate("/checkout", { state: { cartItems, userId, userName, subtotal } });
  };

  return (
    <div className="cartSection">
      {context.windowWidth > 992 && (
        <div className="breadcrumbWrapper mb-4">
          <div className="container-fluid">
            <ul className="breadcrumb breadcrumb2 mb-0">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>Shop</li>
              <li>Cart</li>
            </ul>
          </div>
        </div>
      )}

      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col-md-8">
            <div className="d-flex align-items-center w-100">
              <div className="left">
                <h1 className="hd mb-0">Your Cart</h1>
                <p>
                  There are <span className="text-g">{cartItems.length}</span>{" "}
                  products in your cart
                </p>
              </div>
            </div>

            <div className="cartWrapper mt-4">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Unit Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.length > 0 ? (
                      cartItems.map((item, index) => (
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
                            <QuantityBox
                              item={item}
                              max="5"
                              cartItems={cartItems}
                              index={index}
                              updateCart={handleUpdateQuantity}
                            />
                          </td>
                          <td>
                            <span className="text-g">
                              Rs.{" "}
                              {item.price &&
                                parseInt(item.price) * parseInt(item.quantity)}
                            </span>
                          </td>
                          <td align="center">
                            <span
                              className="cursor"
                              onClick={() => handleRemoveFromCart(item._id)}
                            >
                              <DeleteOutlineOutlinedIcon className=" fs-2" />
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">No items in cart.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <br />

            <div className="d-flex align-items-center">
              <Link to="/product">
                <Button className="btn-g">
                  <KeyboardBackspaceIcon /> Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          <div className="col-md-4 cartRightBox">
            <div className="card p-4" style={{ backgroundColor: "#E9DBBB" }}>
              <div className="d-flex align-items-center mb-4">
                <h3 className="mb-0 text-light">Subtotal :</h3>
                <h3 className="ml-auto mb-0 font-weight-bold">
                  <span className="text-g">Rs. {subtotal}</span>
                </h3>
              </div>

              <br />

              <Button className="btn-g btn-lg" onClick={handleCartItems}>
                Proceed To CheckOut
              </Button>
              {/* 
              {console.log("this is cart items")}
              {console.log(cartItems)} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
