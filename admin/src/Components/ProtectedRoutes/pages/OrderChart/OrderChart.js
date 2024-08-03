import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./style.css"; // Import the CSS file
import axiosInstance from "../../../api/axiosInstance";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const OrderChart = () => {
  const [orders, setOrders] = useState([]);
  const [chartData, setChartData] = useState({});

  // Fetch orders from the database
  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/get-all-orders",
        { withCredentials: true }
      );

      // Filter orders to get those from the last year
      const filteredOrders = response.data.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const today = new Date();
        const oneYearAgo = new Date(today.setFullYear(today.getFullYear() - 1));
        return orderDate >= oneYearAgo;
      });

      setOrders(filteredOrders);
      generateChartData(filteredOrders);
    } catch (err) {
      console.log(err);
    }
  };

  // Generate chart data
  const generateChartData = (orders) => {
    const monthsArray = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
    }).reverse();

    const ordersPerMonth = monthsArray.map((month) => {
      return orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const orderMonth = orderDate.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        return orderMonth === month;
      }).length;
    });

    setChartData({
      type: "line",
      labels: monthsArray,
      datasets: [
        {
          label: "Orders in the Last 12 Months",
          data: ordersPerMonth,
          fill: false,
          borderColor: "#007bff",
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
        },
      ],
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Month",
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 12, // Adjust max number of visible ticks
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Orders",
        },
      },
    },
  };

  return (
    <div className="chart-container mt-5">
      <h1 className="chart-title">Orders Analysis</h1>
      {chartData.labels ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p className="loading-text">Loading...</p>
      )}
    </div>
  );
};

export default OrderChart;
