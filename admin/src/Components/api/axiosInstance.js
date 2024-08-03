// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/", 
  // baseURL: 'https://back.eherbals.in/',
});

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach the token to the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
