import React, { useState, useEffect } from "react";
import "./Order.css";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { MdAddShoppingCart } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { MdOutlinePendingActions } from "react-icons/md";
import axios from "axios";
import axiosInstance from "../../../api/axiosInstance";

const OrdersDetails = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/get-all-orders",
          { withCredentials: true }
        );
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        const filteredOrders = response.data.filter((order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= thirtyDaysAgo;
        });
        setOrders(filteredOrders);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchCustomers = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/get-All-user",
          { withCredentials: true }
        );
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        const filteredCustomers = response.data.filter((customer) => {
          const customerDate = new Date(customer.createdAt);
          return customerDate >= thirtyDaysAgo;
        });
        setCustomers(filteredCustomers);
      } catch (err) {
        console.log(err);
      }
    };

    fetchOrders();
    fetchCustomers();
  }, []); // Empty dependency array ensures this runs only once after the initial render

  // Get total revenue for paid or successful orders
  const totalAmount = orders
    .filter((order) => order.status === "paid" || order.status === "success")
    .reduce((acc, order) => acc + order.totalAmount, 0);

  // Get pending delivery
  const pendingDelivery = orders.filter((order) => order.status === "pending");

  return (
    <div className="mt-5 OrdersInfo">
      <div className="orderInfoContainer">
        <div className="orderBox revenueBox p-2">
          <div className="orderBoxHeader d-flex justify-content-between mt-2">
            <div>
              <h5>Total Revenue</h5>
              <p className="DateCalc">Last 30 days</p>
            </div>
            <div className="orderBoxHeaderRight me-3">
              <RiMoneyRupeeCircleLine />
            </div>
          </div>
          <div className="orderBoxBody mt-2">
            <h3 className="cost">Rs: {totalAmount}</h3>
          </div>
        </div>
        <div className="orderBox T-OrderBox p-2">
          <div className="orderBoxHeader d-flex justify-content-between mt-2">
            <div>
              <h5>Total Orders</h5>
              <p className="DateCalc">Last 30 days</p>
            </div>
            <div className="orderBoxHeaderRight me-3">
              <MdAddShoppingCart />
            </div>
          </div>
          <div className="orderBoxBody mt-2">
            <h3 className="cost">{orders.length}</h3>
          </div>
        </div>
        <div className="orderBox customerBox p-2">
          <div className="orderBoxHeader d-flex justify-content-between mt-2">
            <div>
              <h5>Total Customers</h5>
              <p className="DateCalc">Last 30 days</p>
            </div>
            <div className="orderBoxHeaderRight me-3">
              <LuUsers />
            </div>
          </div>
          <div className="orderBoxBody mt-2">
            <h3 className="cost">{customers.length}</h3>
          </div>
        </div>
        <div className="orderBox DeliverPendingBox p-2">
          <div className="orderBoxHeader d-flex justify-content-between mt-2">
            <div>
              <h5>Pending Delivery</h5>
              <p className="DateCalc">Last 30 days</p>
            </div>
            <div className="orderBoxHeaderRight me-3">
              <MdOutlinePendingActions />
            </div>
          </div>
          <div className="orderBoxBody mt-2">
            <h3 className="cost">{pendingDelivery.length}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersDetails;
