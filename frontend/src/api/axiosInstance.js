import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
//  baseURL: 'https://back.eherbals.in/',
  baseURL: "http://localhost:5000/",
  timeout: 10000, // Set a timeout for requests
});

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach the token to the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a status other than 200 range
      if (error.response.status === 500) {
        console.error('Internal Server Error:', error.response.data);
      }
    } else if (error.request) {
      // Request was made but no response was received
      console.error('Network Error:', error.request);
    } else {
      // Something else caused the error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const getCartItems = async (userId) => {
  try {
    const response = await axiosInstance.get(`api/get-cart-product/${userId}`);
    return response.data.cartItems;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return [];
  }
};

export const getwishItems = async (userId) => {
  try {
    const response = await axiosInstance.get(`api/get-user-wishlist/${userId}`);
    return response.data.Wishlist;
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    return [];
  }
};

export default axiosInstance;
