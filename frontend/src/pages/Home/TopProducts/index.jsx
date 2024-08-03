import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./style.css";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import axiosInstance from "../../../api/axiosInstance";

const theme = createTheme({
  components: {
    MuiRating: {
      styleOverrides: {
        iconFilled: {
          color: "gold", // Set your desired color here
        },
        iconEmpty: {
          color: "lightgray",
        },
      },
    },
  },
});

const TopProducts = (props) => {
  const [topProduct, setTopProduct] = useState([]);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await axiosInstance.get("api/top-selling-products");
        // console.log("Fetched top-selling products:", response.data);
        // Assuming response.data is an array of objects with necessary fields
        const productsWithFormattedRating = response.data.map((product) => ({
          ...product,
          rating: product.ratings, // Assuming ratings are within 0 to 5
        }));
        setTopProduct(productsWithFormattedRating || []);
      } catch (error) {
        console.error("Error fetching top-selling products:", error);
        setTopProduct([]);
      }
    };

    fetchTopProducts();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <ThemeProvider theme={theme}>
      <div className="topSelling_box">
        <h3>{props.title}</h3>
        <div className="topSellingContainer d-flex flex-wrap g-5">
          {topProduct.map((product, index) => (
            <div className="items d-flex flex-column" key={index}>
              <div className="img">
                <Link
                  to={`/product/${product.productId}/${product.modelId}/${product.subProductId}`}
                >
                  <img
                    src={product.image}
                    className="w-100"
                    style={{ width: "250px", height: "250px" }}
                    alt={product.subproductname}
                  />
                </Link>
              </div>
              <div className="info ">
                <Link
                  to={`/sub-product/${product.productId}/models/${product.modelId}/sub/${product.subProductId}`}
                >
                  <h4>{product.subproductname}</h4>
                </Link>
                <Rating
                  name={`rating-${index}`}
                  value={product.ratings || 4} // Default rating if not provided
                  readOnly
                />
                <div className="d-flex align-items-center">
                  <span className="price text-g font-weight-bold">
                    Rs :{product.offerPrice}
                  </span>{" "}
                  <span className="oldPrice">Rs :{product.currentPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default TopProducts;
