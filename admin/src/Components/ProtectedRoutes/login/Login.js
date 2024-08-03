import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "axios";
import {
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        { email, password }
      );

      if (response.data.success) {
        onLogin();
        localStorage.setItem("auth", true);
        navigate("/");
      } else {
        setError("Invalid credentials. Please enter correct email and password.");
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      setError("Failed to log in. Please try again later.");
    }
  };

  const handleForgotPassword = async (values) => {
    try {
      // Implement your client-side email sending logic here
      toggleModal();
    } catch (error) {
      console.error("Error sending reset password email:", error.message);
      alert("Failed to send reset password email. Please try again later.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-wrapper">
      <div className="glass-effect"></div>
      <div className="login-card">
        <h3 className="logo-text">Welcome Admin</h3>
        <h2 className="login-header">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" "
          />
          <label htmlFor="email" className="form-label">
            Email
          </label>
        </div>
        <div className="form-group password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=" "
          />
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            className="eye-icon"
            onClick={togglePasswordVisibility}
          />
        </div>
        <button
          type="button"
          className="btn btn-primary w-100 mb-3"
          onClick={handleLogin}
        >
          Login
        </button>
        <p className="forgot-password-text" onClick={toggleModal}>
          Forgot Password?
        </p>
        <Modal isOpen={modalOpen} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Forgot Password?</ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{ email: "" }}
              validationSchema={Yup.object().shape({
                email: Yup.string()
                  .email("Invalid email")
                  .required("Email is required"),
              })}
              onSubmit={(values) => handleForgotPassword(values)}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for="forgot-email">Email Address</Label>
                    <Input
                      type="email"
                      name="email"
                      id="forgot-email"
                      placeholder="Enter your email address"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.email && !!errors.email}
                    />
                    <FormFeedback>{errors.email}</FormFeedback>
                  </FormGroup>
                  <ModalFooter>
                    <Button color="secondary" onClick={toggleModal}>
                      Cancel
                    </Button>
                    <Button type="submit" color="primary">
                      Send Reset Email
                    </Button>
                  </ModalFooter>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
};

export default Login;
