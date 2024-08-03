import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Paper,
  TextField,
  Typography,
  Container,
  Grid,
  CircularProgress,
  Backdrop,
  IconButton,
  Box,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import CloseIcon from "@mui/icons-material/Close";
import logo from "../../assets/logo.jpg";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .matches(
      /^(?=.*[A-Z])(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    )
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const Forgot = () => {
  const { userId, token } = useParams();
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    setShowLoader(true);
    try {
      const response = await axiosInstance.post(
        `api/update-password/${userId}/${token}`,
        {
          password: values.password,
          confirmPassword: values.confirmPassword,
        }
      );

      if (response.status === 200) {
        alert("Password reset successfully");
        navigate("/signin");
      }
    } catch (error) {
      alert("Failed to reset password. Please try again later.");
    } finally {
      setShowLoader(false);
      setSubmitting(false);
    }
  };

  return (
    <Container className="loginWrapper" maxWidth="xs">
      <Backdrop
        sx={{ color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showLoader}
        className="formLoader"
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Paper
        className="card"
        elevation={5}
        sx={{ boxShadow: "none", padding: "20px" }}
      >
        <img className="logo" src={logo} alt="logo" />
        <Typography className="title" variant="h4" align="center" gutterBottom>
          Create a New Password
        </Typography>

        <Formik
          initialValues={{
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            errors,
            touched,
          }) => (
            <Form className="mt-4" onSubmit={handleSubmit}>
              <div className="form-group mb-4 w-100">
                <Box sx={{ position: "relative" }}>
                  <Field
                    as={TextField}
                    name="password"
                    label="New Password"
                    variant="outlined"
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    onChange={handleChange}
                    error={errors.password && touched.password}
                    helperText={
                      errors.password && touched.password && errors.password
                    }
                    FormHelperTextProps={{
                      style: { fontSize: "1.1rem" },
                    }}
                  />
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    {showPassword ? (
                      <VisibilityOutlinedIcon />
                    ) : (
                      <VisibilityOffOutlinedIcon />
                    )}
                  </IconButton>
                </Box>
              </div>
              <div className="form-group mb-4 w-100">
                <Box sx={{ position: "relative" }}>
                  <Field
                    as={TextField}
                    name="confirmPassword"
                    label="Confirm Password"
                    variant="outlined"
                    fullWidth
                    type={showConfirmPassword ? "text" : "password"}
                    onChange={handleChange}
                    error={errors.confirmPassword && touched.confirmPassword}
                    helperText={
                      errors.confirmPassword &&
                      touched.confirmPassword &&
                      errors.confirmPassword
                    }
                    FormHelperTextProps={{
                      style: { fontSize: "1.1rem" },
                    }}
                  />
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    sx={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    {showConfirmPassword ? (
                      <VisibilityOutlinedIcon />
                    ) : (
                      <VisibilityOffOutlinedIcon />
                    )}
                  </IconButton>
                </Box>
              </div>
              <Button
                className="btn btn-g btn-lg w-100"
                variant="contained"
                type="submit"
                color="primary"
                fullWidth
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>

        <Grid container justifyContent="center">
          <Grid item style={{ marginTop: "8px" }}>
            <Link to="/signup" className="link">
              Don't have an account? Register
            </Link>
          </Grid>
        </Grid>
      </Paper>
      <ToastContainer />
    </Container>
  );
};

export default Forgot;
