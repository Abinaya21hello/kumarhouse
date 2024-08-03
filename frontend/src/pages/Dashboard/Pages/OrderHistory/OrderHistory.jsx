import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../api/axiosInstance";
import Sidebar from "../Sidebar";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./Style.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get(
         `api/get-user-order/${userId}`,
          {
            withCredentials: true,
          }
        );
        setOrders(response.data);
        setIsLoading(false);
      } catch (error) {
        // setError("no order");
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  const viewInvoice = async (orderId) => {
    try {
      const response = await axiosInstance.get(`api/invoice/${orderId}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      window.open(url, "_blank");
    } catch (error) {
      // console.error("Error fetching invoice:", error);
      alert("Failed to fetch invoice.");
    }
  };

  const cancelOrder = async (orderId) => {
    // Display the native confirm dialog
    const userConfirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    // If user confirmed the cancellation
    if (userConfirmed) {
      try {
        await axiosInstance.put(`api/orders/${orderId}/cancel`);
        alert("Order canceled successfully.");

        // Update the order status in the state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === orderId
              ? { ...order, status: "cancelled" }
              : order
          )
        );
      } catch (error) {
        // Handle error
        alert("Failed to cancel order.");
      }
    }
  };

  const refundOrder = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("orderId", selectedOrder.order_id);
      formData.append("userId", userId);
      formData.append("reason", values.reason);
      formData.append("description", values.description);
      formData.append("image", values.image);

      await axiosInstance.post(`api/refund-request`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Refund processed successfully.");
      closeModal();
      resetForm();
    } catch (error) {
      // console.error("Error processing refund:", error);
      alert("Failed to process refund.");
    }
  };

  const openModal = (orderId) => {
    const order = orders.find((order) => order.order_id === orderId);
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const isRefundEligible = (deliveryDate) => {
    const currentDate = new Date();
    const deliveryDatePlus4 = new Date(deliveryDate);
    deliveryDatePlus4.setDate(deliveryDatePlus4.getDate() + 4);

    const deliveryDateObj = new Date(deliveryDate);

    return currentDate >= deliveryDateObj && currentDate <= deliveryDatePlus4;
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!userId) {
    // return <div className="error">Error: User not logged in.</div>;
    alert(" User not found. Please logged in.");
    navigate("/signIn");
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const handleSubmit = () => {
    navigate("/product");
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="order-history-content">
        {orders.length === 0 ? (
          <div className="d-flex align-items-center justify-content-center  h-100">
            <div className="mt-5">
              <img
                className="orderEmptyImg"
                src="\assets\orderEmptyImg.jpeg"
                alt="order empty"
              />
              <h2 className="text-center mt-2">No orders found.</h2>
              <div className="d-flex justify-content-center mt-4">
                <button
                  className="btn btn-success fs-2 p-1"
                  onClick={handleSubmit}
                >
                  Start Shopping
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <h2>Order History</h2>
            <table className="order-list">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Status</th>
                  <th>Total Amount</th>
                  <th>Date of Order</th>
                  <th>Delivery Date</th>
                  <th>Delivery Status</th>
                  <th>Products</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id.$oid} className="order-item">
                    <td>{order.order_id}</td>
                    <td>{order.status}</td>
                    <td>
                      {order.totalAmount} {order.currency}
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      {new Date(order.deliveryDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td>{order.deliveryStatus}</td>
                    <td>
                      <table className="product-item">
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Grams</th>
                            <th>Price</th>
                            <th>Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.products.map((product) => (
                            <tr key={product._id.$oid}>
                              <td>
                                <img
                                  src={product.ProductImage}
                                  alt={product.ProductName}
                                />
                              </td>
                              <td>{product.ProductName}</td>
                              <td>{product.grams}</td>
                              <td>{product.currentPrice}</td>
                              <td>{product.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                    <td className="view-invoice">
                      {order.deliveryStatus === "received" &&
                        order.status === "paid" && (
                          <button onClick={() => viewInvoice(order.order_id)}>
                            View Invoice
                          </button>
                        )}
                      {order.status === "cancelled" ? (
                        <span>Cancelled</span>
                      ) : (
                        <>
                          {["created", "pending"].includes(order.status) ? (
                            <button
                              className="cancel-order"
                              onClick={() => cancelOrder(order.order_id)}
                            >
                              Cancel Order
                            </button>
                          ) : (
                            ["cancelled"].includes(order.status) && (
                              <span className="cancel_danger">Cancelled</span>
                            )
                          )}
                          {order.status === "paid" &&
                            isRefundEligible(order.deliveryDate) && (
                              <button
                                className="refund-order"
                                onClick={() => openModal(order.order_id)}
                              >
                                Refund
                              </button>
                            )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showModal && selectedOrder && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h3>Refund Details</h3>
            <Formik
              initialValues={{
                reason: "",
                description: "",
                image: null, // Initialize image as null
              }}
              validationSchema={Yup.object().shape({
                reason: Yup.string().required("Reason is required"),
                description: Yup.string().required("Description is required"),
                image: Yup.mixed().required("Image is required"), // Validate image field
              })}
              onSubmit={(values, { resetForm }) => {
                refundOrder(values, { resetForm });
              }}
            >
              {({ setFieldValue }) => (
                <Form>
                  <ErrorMessage
                    name="reason"
                    component="div"
                    className="error"
                  />
                  <div>
                    <label htmlFor="reason">Reason:</label>
                    <Field
                      as="select"
                      id="reason"
                      name="reason"
                      onChange={(e) => {
                        setFieldValue("reason", e.target.value);
                      }}
                    >
                      <option value="">Select a reason</option>
                      <option value="damage">Damage</option>
                      <option value="wrong product">Wrong Product</option>
                      <option value="other">Others</option>
                    </Field>
                  </div>
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="error"
                  />
                  <div>
                    <label htmlFor="description">Description:</label>
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      rows="4"
                      cols="50"
                      placeholder="Enter description..."
                    />
                  </div>
                  <ErrorMessage
                    name="image"
                    component="div"
                    className="error"
                  />
                  <div>
                    <label htmlFor="image">Upload Image:</label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={(event) => {
                        setFieldValue("image", event.currentTarget.files[0]);
                      }}
                    />
                  </div>
                  <button type="submit">Confirm Refund</button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default OrderHistory;