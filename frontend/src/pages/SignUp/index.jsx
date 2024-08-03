import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { sendOtp, verifyOtpAndRegister } from "../../redux/actions/userActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css"; // Custom CSS for responsive styling

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, otpSent } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const emailBoundaryList = ["gmail.com", "permitted.com"];

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      gender: "",
      password: "",
      confirmPassword: "",
      address: [
        {
          street: "",
          district: "",
          state: "",
          country: "",
          pincode: "",
        },
      ],
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(
          /^[a-zA-Z\s]+$/,
          "Name should not contain numbers or special characters"
        )
        .max(15, "Name must be at most 15 characters")
        .required("Name is required"),
      email: Yup.string()
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Invalid email address format"
        )
        .min(12, "Email address is too short")
        .required("Email is required"),
      phone: Yup.string()
        .matches(/^[1-9][0-9]{9,11}$/, {
          message:
            "Phone number must be between 10 digits and should not start with 0",
          excludeEmptyString: true,
        })
        .max(10, "Phone must be  10 digit only")
        .required("Phone is required"),
      gender: Yup.string().required("Gender is required"),
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
      address: Yup.array()
        .of(
          Yup.object().shape({
            street: Yup.string()
              .matches(
                /^[a-zA-Z\s]+$/,
                "Street should not contain numbers or special characters"
              )
              .max(15, "Street must be at most 15 characters")
              .required("Street is required"),
            district: Yup.string()
              .matches(
                /^[a-zA-Z\s]+$/,
                "District should not contain numbers or special characters"
              )
              .max(15, "District must be at most 15 characters")
              .required("District is required"),
            state: Yup.string()
              .matches(
                /^[a-zA-Z\s]+$/,
                "State should not contain numbers or special characters"
              )
              .max(15, "State must be at most 15 characters")
              .required("State is required"),
            country: Yup.string()
              .matches(
                /^[a-zA-Z\s]+$/,
                "Country should not contain numbers or special characters"
              )
              .max(15, "Country must be at most 15 characters")
              .required("Country is required"),
            pincode: Yup.string()
              .max(6, "Pincode must be at most 6 characters")
              .required("Pincode is required"),
          })
        )
        .required("Address is required"),
    }),

    onSubmit: async (values) => {
      // Trim all values before sending
      const trimmedValues = {
        ...values,
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        gender: values.gender.trim(),
        password: values.password.trim(),
        confirmPassword: values.confirmPassword.trim(),
        address: values.address.map((addr) => ({
          ...addr,
          street: addr.street.trim(),
          district: addr.district.trim(),
          state: addr.state.trim(),
          country: addr.country.trim(),
          pincode: addr.pincode.trim(),
        })),
      };

      try {
        await dispatch(sendOtp(trimmedValues));
        setOpenOtpModal(true);
      } catch (error) {
        console.error("Failed to send OTP:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          error.response.data.errors.forEach((err) => {
            alert(`${err.msg}: ${err.value}`);
          });
        } else {
          alert(error.message || "An error occurred during OTP sending.");
        }
      }
    },
  });
  showConfirmPassword;
  const handleOtpVerification = async () => {
    try {
      await dispatch(verifyOtpAndRegister(formik.values, otp, navigate));
      setOpenOtpModal(false);
    } catch (error) {
      console.error("Failed to verify OTP:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        error.response.data.errors.forEach((err) => {
          alert(`${err.msg}: ${err.value}`);
        });
      } else {
        alert("Invalid OTP");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <>
      <section className="signUp mb-5">
        <div className="breadcrumbWrapper">
          <div className="container-fluid">
            <ul className="breadcrumb breadcrumb2 mb-0">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>Sign Up</li>
            </ul>
          </div>
        </div>

        <div className="loginWrapper">
          <div className="card shadow">
            <h3 className="text-center">Sign Up</h3>

            <form className="mt-4" onSubmit={formik.handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <TextField
                    id="name"
                    name="name"
                    label="Name"
                    className="w-100"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    FormHelperTextProps={{
                      style: { fontSize: "1.1rem" },
                    }}
                  />
                </div>
                <div className="col-md-6 mb-4">
                  <TextField
                    id="email"
                    name="email"
                    label="Email"
                    className="w-100"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    FormHelperTextProps={{
                      style: { fontSize: "1.1rem" },
                    }}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <TextField
                    id="phone"
                    name="phone"
                    label="Phone"
                    className="w-100"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                    FormHelperTextProps={{
                      style: { fontSize: "1.1rem" },
                    }}
                  />
                </div>

                <div className="col-md-6 col-sm-12 mb-3">
                  <FormControl fullWidth>
                    <TextField
                      id="gender"
                      name="gender"
                      label="Gender"
                      select
                      className="w-100"
                      value={formik.values.gender}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.gender && Boolean(formik.errors.gender)
                      }
                      helperText={formik.touched.gender && formik.errors.gender}
                      FormHelperTextProps={{
                        style: { fontSize: "1.1rem" },
                      }}
                      SelectProps={{
                        MenuProps: {
                          PaperProps: {
                            style: {
                              minWidth: "200px !important",
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem value="">Select Gender</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                  </FormControl>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <TextField
                    id="street"
                    name="address[0].street"
                    label="Street"
                    className="w-100"
                    value={formik.values.address[0].street}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.address &&
                      formik.touched.address[0] &&
                      formik.touched.address[0].street &&
                      Boolean(formik.errors.address) &&
                      Boolean(formik.errors.address[0]?.street)
                    }
                    helperText={
                      formik.touched.address &&
                      formik.touched.address[0] &&
                      formik.touched.address[0].street &&
                      formik.errors.address &&
                      formik.errors.address[0]?.street
                    }
                    FormHelperTextProps={{
                      style: { fontSize: "1.1rem" },
                    }}
                  />
                </div>
                <div className="col-md-6 mb-4">
                  <TextField
                    id="district"
                    name="address[0].district"
                    label="District"
                    className="w-100"
                    value={formik.values.address[0].district}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.address &&
                      formik.touched.address[0] &&
                      formik.touched.address[0].district &&
                      Boolean(formik.errors.address) &&
                      Boolean(formik.errors.address[0]?.district)
                    }
                    helperText={
                      formik.touched.address &&
                      formik.touched.address[0] &&
                      formik.touched.address[0].district &&
                      formik.errors.address &&
                      formik.errors.address[0]?.district
                    }
                    FormHelperTextProps={{
                      style: { fontSize: "1.1rem" },
                    }}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <TextField
                    id="state"
                    name="address[0].state"
                    label="State"
                    className="w-100"
                    value={formik.values.address[0].state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.address &&
                      formik.touched.address[0] &&
                      formik.touched.address[0].state &&
                      Boolean(formik.errors.address) &&
                      Boolean(formik.errors.address[0]?.state)
                    }
                    helperText={
                      formik.touched.address &&
                      formik.touched.address[0] &&
                      formik.touched.address[0].state &&
                      formik.errors.address &&
                      formik.errors.address[0]?.state
                    }
                    FormHelperTextProps={{
                      style: { fontSize: "1.1rem" },
                    }}
                  />
                </div>
                <div className="col-md-6 mb-4">
                  <TextField
                    id="country"
                    name="address[0].country"
                    label="Country"
                    className="w-100"
                    value={formik.values.address[0].country}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.address &&
                      formik.touched.address[0] &&
                      formik.touched.address[0].country &&
                      Boolean(formik.errors.address) &&
                      Boolean(formik.errors.address[0]?.country)
                    }
                    helperText={
                      formik.touched.address &&
                      formik.touched.address[0] &&
                      formik.touched.address[0].country &&
                      formik.errors.address &&
                      formik.errors.address[0]?.country
                    }
                    FormHelperTextProps={{
                      style: { fontSize: "1.1rem" },
                    }}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <TextField
                    id="pincode"
                    name="address[0].pincode"
                    label="Pincode"
                    className="w-100"
                    value={formik.values.address[0].pincode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.address &&
                      formik.touched.address[0] &&
                      formik.touched.address[0].pincode &&
                      Boolean(formik.errors.address) &&
                      Boolean(formik.errors.address[0]?.pincode)
                    }
                    helperText={
                      formik.touched.address &&
                      formik.touched.address[0] &&
                      formik.touched.address[0].pincode &&
                      formik.errors.address &&
                      formik.errors.address[0]?.pincode
                    }
                    FormHelperTextProps={{
                      style: { fontSize: "1.1rem" },
                    }}
                  />
                </div>
                <div className="col-md-6 mb-4">
                  <TextField
                    id="password"
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    className="w-100"
                    // value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    FormHelperTextProps={{
                      style: { fontSize: "1.1rem" },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <TextField
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-100"
                    // value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.confirmPassword &&
                      Boolean(formik.errors.confirmPassword)
                    }
                    helperText={
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                    }
                    FormHelperTextProps={{
                      style: { fontSize: "1.1rem" },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={toggleConfirmPasswordVisibility}
                          >
                            {showConfirmPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              </div>

              {/* <div className="row"></div> */}

              <div className="row">
                <div className="col-md-12 text-center">
                  <Button
                    className="btn btn-g btn-lg"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Signing Up..." : "Sign Up"}
                  </Button>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 text-center">
                  <p className="text-center">
                    Already have an account? <Link to="/signIn">Sign In</Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Dialog
        open={openOtpModal}
        onClose={() => setOpenOtpModal(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Verify OTP</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="otp"
            label="Enter OTP"
            type="text"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value.trim())}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenOtpModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleOtpVerification} color="primary">
            Verify
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </>
  );
};

export default SignUp;
