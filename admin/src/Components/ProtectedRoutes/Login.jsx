import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Modal,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined } from "@mui/icons-material";
import Cookies from "js-cookie";
import axiosInstance from "../api/axiosInstance";
import "./Login.css";

import "./Login.css";

const Login = ({ onLogin }) => {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (values) => {
    const { email, password } = values;
    try {
      const response = await axiosInstance.post(
        "/api/loginforadmin",
        { email, password },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        console.log("Login successful.");
        onLogin();
        const accessToken = Cookies.get("accessToken");
        localStorage.setItem("auth", true);
        localStorage.setItem("accessToken", accessToken);

        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          navigate("/");
        }, 2000); // Show alert for 2 seconds

        navigate("/");

      } else {
        setError(
          "Invalid credentials. Please enter correct email and password."
        );
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      setError("Failed to log in. Please try again later.");
    }
  };

  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleForgotPassword = async (values) => {
    try {
      const response = await axios.post("/api/send-reset-email", {
        email: values.email,
      });
      alert(response.data.message);
      toggleModal();
    } catch (error) {
      console.error("Error sending reset password email:", error.message);
      alert("Failed to send reset password email. Please try again later.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="AdminLoginContainer">

      <Box
        className="glass-effect"
        sx={{
          backdropFilter: "blur(10px)",
          p: 4,
          borderRadius: 2,
          maxWidth: 400,
          mx: "auto",
          textAlign: "center",
        }}
      >
        <LockOutlined className="lock-icon" fontSize="large" />{" "}

        {/* Lock icon in black */}
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome Admin
        </Typography>

        {/* <Typography variant="h6" component="h2" gutterBottom>
          Login
        </Typography> */}

        <Typography variant="h6" component="h2" gutterBottom>
          Login
        </Typography>

        {error && <Typography color="error">{error}</Typography>}
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("Invalid email")
              .required("Email is required"),
            password: Yup.string().required("Password is required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            handleLogin(values);
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                margin="normal"

                variant="standard"

                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                className="MuiTextField-root"
              />
              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"

                variant="standard"

                // value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        className="MuiIconButton-root"
                      >

                        {showPassword ? <Visibility /> : <VisibilityOff />}

                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                className="MuiTextField-root"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 3 }}
                className="MuiButton-root"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          )}
        </Formik>
      </Box>
      <Modal open={modalOpen} onClose={toggleModal}>
        <Paper sx={{ p: 4, maxWidth: 400, mx: "auto", mt: "10%" }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Forgot Password?
          </Typography>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .matches(
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  "Invalid email address format"
                )
                .min(3, "Email address is too short")
                .required("Email is required"),
            })}
            onSubmit={(values) => {
              handleForgotPassword(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  className="MuiTextField-root"
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button onClick={toggleModal} color="secondary">
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    Send Reset Email
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Paper>
      </Modal>
    </div>
  );
};

export default Login;
