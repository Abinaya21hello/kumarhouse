import logo from "./logo.svg";
import "./App.css";
import DashboardLayout from "./Components/Dashboard/DashboardLayout";
import React, { useState, useEffect } from "react";
import Login from "./Components/ProtectedRoutes/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import ImageLoader from "./ImageLoader/ImageLoader";
import LogoImage from "./assets/Kumar Herbals - Logo.png";
import LazyPageNotFound from "./Components/Pagenotfound/Pagenotfoound"; // Add this import

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      if (localStorage.getItem("auth")) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setLoader(true);
    }, 2000); // simulate loading delay
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      {isLoading ? (
        <div className="loading-screen">
          <ImageLoader src={LogoImage} alt="Loading" />
        </div>
      ) : (
        loader && (
          <Routes>
            <Route
              path="/*"
              element={
                isLoggedIn ? (
                  <DashboardLayout />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/404" element={<LazyPageNotFound />} />
          </Routes>
        )
      )}
    </div>
  );
}

export default App;
